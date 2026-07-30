package main

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/xuri/excelize/v2"
)

// ReadProducts 读取 Excel 商品列表
func ReadProducts(filePath string) ([]Product, error) {

	f, err := excelize.OpenFile(filePath)
	if err != nil {
		return nil, fmt.Errorf(
			"无法打开 Excel 文件: %w",
			err,
		)
	}

	defer f.Close()

	sheet := f.GetSheetName(0)

	rows, err := f.GetRows(sheet)
	if err != nil {
		return nil, err
	}

	// Excel结构：
	//
	// 第1行：筛选/说明
	// 第2行：标题
	// 第3行开始：数据
	//
	if len(rows) < 3 {
		return nil, fmt.Errorf(
			"Excel 数据不足",
		)
	}

	// 第二行作为字段标题
	header := rows[1]

	columnMap := buildColumnMap(header)

	for k, v := range columnMap {
		fmt.Printf("HEADER [%d] = %q\n", v, k)
	}

	products := make(
		[]Product,
		0,
		len(rows),
	)

	// 从第三行开始读取
	for _, row := range rows[2:] {

		if len(row) == 0 {
			continue
		}

		product := parseProduct(
			row,
			columnMap,
		)

		// 没有编码和名称认为无效
		if product.Code == "" &&
			product.Name == "" {
			continue
		}

		products = append(
			products,
			product,
		)
	}

	return products, nil
}

// buildColumnMap
//
// 标题 -> 列号
//
// 例如:
//
// 公司编码 -> 6
// 品名 -> 7
func buildColumnMap(
	header []string,
) map[string]int {

	result := make(
		map[string]int,
	)

	for index, name := range header {

		name = normalizeExcelText(name)

		if name == "" {
			continue
		}

		result[name] = index
	}

	return result
}

// parseProduct
//
// 根据 Excel 标题解析商品
func parseProduct(
	row []string,
	columns map[string]int,
) Product {

	code := getExcelValue(
		row,
		columns,
		"公司编码",
	)

	weightText := strings.ReplaceAll(
		getExcelValue(
			row,
			columns,
			"克重(g)",
		),
		"g",
		"",
	)

	weightText = strings.TrimSpace(
		weightText,
	)

	weight, _ := strconv.ParseFloat(
		weightText,
		64,
	)

	id, _ := strconv.Atoi(
		getExcelValue(
			row,
			columns,
			"序号",
		),
	)

	return Product{

		IsStock: getExcelValue(
			row,
			columns,
			"是否常备",
		),

		ID: id,

		ImageURL: GetProductImageByCode(
			code,
		),

		Supplier: getExcelValue(
			row,
			columns,
			"供应商",
		),

		MaterialNo: getExcelValue(
			row,
			columns,
			"公司料号",
		),

		Code: code,

		Name: getExcelValue(
			row,
			columns,
			"品名",
		),

		CapacityML: getExcelValue(
			row,
			columns,
			"罐装容量(ml)",
		),

		CapacityOZ: getExcelValue(
			row,
			columns,
			"盎司/英制(fl.oz.)",
		),

		FiberSpec: getExcelValue(
			row,
			columns,
			"纤维棒规格",
		),

		FiberCount: getExcelValue(
			row,
			columns,
			"纤维棒根数",
		),

		CantonName: getExcelValue(
			row,
			columns,
			"广交会名称更新记录",
		),

		CantonSpec: getExcelValue(
			row,
			columns,
			"广交会规格",
		),

		HistorySpec: getExcelValue(
			row,
			columns,
			"以往订单纤维棒规格",
		),

		EvaporationPeriod: getExcelValue(
			row,
			columns,
			"挥发周期",
		),

		WeightG: weight,

		MouthSpec: getExcelValue(
			row,
			columns,
			"牙口",
		),

		Dimensions: getExcelValue(
			row,
			columns,
			"器皿规格(mm)",
		),
	}
}

// getExcelValue
//
// 根据标题获取单元格
func getExcelValue(
	row []string,
	columns map[string]int,
	name string,
) string {

	index, ok := columns[name]

	if !ok {
		return ""
	}

	if index >= len(row) {
		return ""
	}

	return normalizeExcelText(
		row[index],
	)
}

// normalizeExcelText
// 清理 Excel 单元格格式
func normalizeExcelText(value string) string {

	return strings.TrimSpace(
		strings.NewReplacer(
			"\r\n", "",
			"\n", "",
			"\r", "",
			"（", "(",
			"）", ")",
		).Replace(value),
	)
}
