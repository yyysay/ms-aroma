import { mkdir, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import ExcelJS from "exceljs";

import type { Product, ProductsResponse } from "../src/lib/types.ts";
import { paths } from "./paths.ts";

const requiredColumns = ["序号", "公司编码", "品名"] as const;

function normalizeExcelText(value: string): string {
  return value
    .replaceAll("\r\n", "")
    .replaceAll("\n", "")
    .replaceAll("\r", "")
    .replaceAll("（", "(")
    .replaceAll("）", ")")
    .trim();
}

function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseNumber(value: string): number {
  const number = Number.parseFloat(value.replaceAll("g", "").trim());
  return Number.isFinite(number) ? number : 0;
}

function safeImageStem(code: string): string | null {
  const trimmed = code.trim();
  if (
    trimmed.length === 0 ||
    trimmed === "." ||
    trimmed === ".." ||
    trimmed.includes("/") ||
    trimmed.includes("\\") ||
    trimmed.includes("\0")
  ) {
    return null;
  }
  return trimmed;
}

async function imageUrlFor(code: string): Promise<string> {
  const stem = safeImageStem(code);
  if (!stem) return "/images/default.webp";

  try {
    await stat(path.join(paths.outputImages, `${stem}.webp`));
    return `/images/${encodeURIComponent(stem)}.webp`;
  } catch {
    return "/images/default.webp";
  }
}

async function main(): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(paths.sourceExcel);

  const worksheet = workbook.worksheets[0];
  if (!worksheet || worksheet.rowCount < 3) {
    throw new Error("Excel 数据不足：需要说明行、标题行和至少一行数据");
  }

  const columns = new Map<string, number>();
  worksheet.getRow(2).eachCell({ includeEmpty: false }, (cell, columnNumber) => {
    const name = normalizeExcelText(cell.text);
    if (name) columns.set(name, columnNumber);
  });

  const missingColumns = requiredColumns.filter((name) => !columns.has(name));
  if (missingColumns.length > 0) {
    throw new Error(`Excel 缺少必需列：${missingColumns.join("、")}`);
  }

  const valueAt = (rowNumber: number, name: string): string => {
    const columnNumber = columns.get(name);
    if (!columnNumber) return "";
    return normalizeExcelText(worksheet.getRow(rowNumber).getCell(columnNumber).text);
  };

  const products: Product[] = [];
  for (let rowNumber = 3; rowNumber <= worksheet.rowCount; rowNumber += 1) {
    const code = valueAt(rowNumber, "公司编码");
    const name = valueAt(rowNumber, "品名");
    if (!code && !name) continue;

    const id = Number.parseInt(valueAt(rowNumber, "序号"), 10);
    products.push({
      id: Number.isFinite(id) ? id : 0,
      is_stock: valueAt(rowNumber, "是否常备"),
      image_url: await imageUrlFor(code),
      supplier: valueAt(rowNumber, "供应商"),
      material_no: valueAt(rowNumber, "公司料号"),
      code,
      name,
      capacity_ml: valueAt(rowNumber, "罐装容量(ml)"),
      capacity_oz: valueAt(rowNumber, "盎司/英制(fl.oz.)"),
      fiber_spec: valueAt(rowNumber, "纤维棒规格"),
      fiber_count: valueAt(rowNumber, "纤维棒根数"),
      canton_name: valueAt(rowNumber, "广交会名称更新记录"),
      canton_spec: valueAt(rowNumber, "广交会规格"),
      history_spec: valueAt(rowNumber, "以往订单纤维棒规格"),
      evaporation_period: valueAt(rowNumber, "挥发周期"),
      weight_g: parseNumber(valueAt(rowNumber, "克重(g)")),
      mouth_spec: valueAt(rowNumber, "牙口"),
      dimensions: valueAt(rowNumber, "器皿规格(mm)"),
    });
  }

  const sourceInfo = await stat(paths.sourceExcel);
  const response: ProductsResponse = {
    updated_at: toDateString(sourceInfo.mtime),
    products,
  };

  await mkdir(path.dirname(paths.productsJson), { recursive: true });
  const temporaryFile = `${paths.productsJson}.tmp`;
  await writeFile(temporaryFile, `${JSON.stringify(response)}\n`, "utf8");
  await rename(temporaryFile, paths.productsJson);

  console.log(`商品数据生成完成：${products.length} 条 -> ${paths.productsJson}`);
}

await main();
