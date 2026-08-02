// 数据类型
// 来自 excel

export interface ProductsResponse {

    updated_at:string;

    products:Product[];

}

export interface Product {

    id:number;

    is_stock:string;

    image_url:string;

    supplier?:string;

    material_no?:string;

    code?:string;

    name:string;

    capacity_ml?:string;

    capacity_oz?:string;

    fiber_spec?:string;

    fiber_count?:string;

    canton_name?:string;

    canton_spec?:string;

    history_spec?:string;

    evaporation_period?:string;

    weight_g?:number;

    mouth_spec?:string;

    dimensions?:string;

}