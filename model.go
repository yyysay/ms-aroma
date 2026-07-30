package main

// Product 商品信息
type Product struct {
	ID                int     `json:"id"`
	IsStock           string  `json:"is_stock"`
	ImageURL          string  `json:"image_url"`
	Supplier          string  `json:"supplier"`
	MaterialNo        string  `json:"material_no"`
	Code              string  `json:"code"`
	Name              string  `json:"name"`
	CapacityML        string  `json:"capacity_ml"`
	CapacityOZ        string  `json:"capacity_oz"`
	FiberSpec         string  `json:"fiber_spec"`
	FiberCount        string  `json:"fiber_count"`
	CantonName        string  `json:"canton_name"`
	CantonSpec        string  `json:"canton_spec"`
	HistorySpec       string  `json:"history_spec"`
	EvaporationPeriod string  `json:"evaporation_period"`
	WeightG           float64 `json:"weight_g"`
	MouthSpec         string  `json:"mouth_spec"`
	Dimensions        string  `json:"dimensions"`
}

// ProductsResponse API 返回结构
type ProductsResponse struct {

	// Excel 更新时间
	UpdatedAt string `json:"updated_at"`

	// 商品列表
	Products []Product `json:"products"`
}
