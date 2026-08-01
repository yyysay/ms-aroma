import type { ProductsResponse } from "./types";



import { API_URL } from "./config";



export async function getProducts()
:Promise<ProductsResponse>{


    const response =
        await fetch(
            `${API_URL}/api/products`
        );


    if(!response.ok){

        throw new Error(
            `API request failed:${response.status}`
        );

    }


    return await response.json();

}