import type { ProductsResponse } from "./types";
import productsData from "../../public/data/products.json";

export function getProducts(): ProductsResponse {
  return productsData satisfies ProductsResponse;
}
