import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

import { paths } from "./paths.ts";

const supportedExtensions = new Set([
  ".avif",
  ".gif",
  ".heic",
  ".jpeg",
  ".jpg",
  ".png",
  ".tif",
  ".tiff",
  ".webp",
]);

async function isUpToDate(source: string, output: string): Promise<boolean> {
  try {
    const [sourceInfo, outputInfo] = await Promise.all([
      stat(source),
      stat(output),
    ]);
    return outputInfo.mtimeMs >= sourceInfo.mtimeMs;
  } catch {
    return false;
  }
}

async function processImage(source: string, output: string): Promise<void> {
  const resized = await sharp(source)
    .rotate()
    .trim({ background: "#ffffff", threshold: 10 })
    .resize(720, 720, { fit: "inside" })
    .flatten({ background: "#ffffff" })
    .toBuffer();

  await sharp({
    create: {
      width: 800,
      height: 800,
      channels: 3,
      background: "#ffffff",
    },
  })
    .composite([{ input: resized, gravity: "centre" }])
    .webp({ quality: 80 })
    .toFile(output);
}

async function main(): Promise<void> {
  await mkdir(paths.outputImages, { recursive: true });

  const entries = await readdir(paths.sourceImages, { withFileTypes: true });
  let processed = 0;
  let skipped = 0;
  const failures: string[] = [];

  for (const entry of entries) {
    if (!entry.isFile()) continue;

    const extension = path.extname(entry.name).toLowerCase();
    if (!supportedExtensions.has(extension)) continue;

    const source = path.join(paths.sourceImages, entry.name);
    const output = path.join(
      paths.outputImages,
      `${path.basename(entry.name, extension)}.webp`,
    );

    if (await isUpToDate(source, output)) {
      skipped += 1;
      continue;
    }

    try {
      await processImage(source, output);
      processed += 1;
      console.log(`✓ ${entry.name} -> ${path.basename(output)}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push(`${entry.name}: ${message}`);
    }
  }

  console.log(
    `图片处理完成：生成 ${processed}，跳过 ${skipped}，失败 ${failures.length}`,
  );

  if (failures.length > 0) {
    throw new Error(`图片处理失败：\n${failures.join("\n")}`);
  }
}

await main();
