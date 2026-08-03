import type { ProductsResponse } from "../lib/types";
import { renderProductDetail } from "./product-detail";

let productsRequest: Promise<ProductsResponse> | undefined;

function loadProducts(): Promise<ProductsResponse> {
    productsRequest ??= fetch("/data/products.json").then((response) => {
        if (!response.ok) {
            throw new Error(`商品数据加载失败：${response.status}`);
        }

        return response.json() as Promise<ProductsResponse>;
    });

    return productsRequest;
}

export function initModal() {
    const modal = document.querySelector("#product-modal");

    if (!modal) {
        return;
    }

    const closeModal = () => {
        modal.classList.add("hidden");
    };

    document.addEventListener("click", async (event) => {
        const target = event.target as HTMLElement;
        const card = target.closest<HTMLElement>(".product-card");

        if (!card) {
            return;
        }

        const productIndex = Number.parseInt(
            card.dataset.productIndex ?? "",
            10,
        );

        if (!Number.isInteger(productIndex)) {
            console.error("无效的商品索引", card.dataset.productIndex);
            return;
        }

        try {
            const data = await loadProducts();
            const product = data.products[productIndex];

            if (!product) {
                console.error("未找到商品", productIndex);
                return;
            }

            renderProductDetail(product);
            modal.classList.remove("hidden");
        } catch (error) {
            console.error(error);
        }
    });

    document
        .querySelector("#modal-close")
        ?.addEventListener("click", closeModal);

    modal.addEventListener("click", (event) => {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeModal();
        }
    });
}
