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

async function copyText(value: string): Promise<void> {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(value);
            return;
        } catch {
            // Fall through to the compatibility path.
        }
    }

    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.append(textarea);
    textarea.select();

    const legacyDocument = document as unknown as {
        execCommand(commandId: string): boolean;
    };
    const copied = legacyDocument.execCommand("copy");
    textarea.remove();

    if (!copied) {
        throw new Error("浏览器拒绝访问剪贴板");
    }
}

export function initModal() {
    const modal = document.querySelector<HTMLElement>("#product-modal");
    const closeButton = document.querySelector<HTMLButtonElement>("#modal-close");
    const backdrop = document.querySelector<HTMLButtonElement>("#modal-backdrop");
    const copyToast = document.querySelector<HTMLElement>("#copy-toast");

    if (!modal || !closeButton || !backdrop || !copyToast) return;

    let copyToastTimer: ReturnType<typeof setTimeout> | undefined;

    const setOpen = (open: boolean) => {
        modal.classList.toggle("visible", open);
        modal.classList.toggle("opacity-100", open);
        modal.classList.toggle("invisible", !open);
        modal.classList.toggle("opacity-0", !open);
        modal.setAttribute("aria-hidden", String(!open));
        document.body.classList.toggle("overflow-hidden", open);
    };

    const closeModal = () => {
        if (modal.getAttribute("aria-hidden") === "true") return;
        setOpen(false);
    };

    document.addEventListener("click", async (event) => {
        const target = event.target as HTMLElement;
        const card = target.closest<HTMLElement>(".product-card");

        if (!card) return;

        const productIndex = Number.parseInt(card.dataset.productIndex ?? "", 10);
        if (!Number.isInteger(productIndex)) return;

        try {
            const data = await loadProducts();
            const product = data.products[productIndex];
            if (!product) return;

            renderProductDetail(product);
            setOpen(true);
            closeButton.focus({ preventScroll: true });
        } catch (error) {
            console.error(error);
        }
    });

    closeButton.addEventListener("click", closeModal);
    backdrop.addEventListener("click", closeModal);

    modal.addEventListener("click", async (event) => {
        const target = event.target as HTMLElement;
        const copyTarget = target.closest<HTMLElement>("[data-copy]");
        const value = copyTarget?.dataset.copyValue;

        if (!copyTarget || !value) return;

        try {
            await copyText(value);
            copyToast.classList.remove("translate-y-2", "opacity-0");
            copyToast.classList.add("translate-y-0", "opacity-100");

            if (copyToastTimer) clearTimeout(copyToastTimer);
            copyToastTimer = setTimeout(() => {
                copyToast.classList.remove("translate-y-0", "opacity-100");
                copyToast.classList.add("translate-y-2", "opacity-0");
            }, 1000);
        } catch (error) {
            console.error("复制失败", error);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeModal();
    });
}
