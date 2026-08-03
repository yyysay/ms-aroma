import type { Product } from "../lib/types";

const codeBadgePalettes = [
    ["bg-rose-100/75", "text-rose-700", "ring-rose-200/70"],
    ["bg-amber-100/75", "text-amber-700", "ring-amber-200/70"],
    ["bg-emerald-100/75", "text-emerald-700", "ring-emerald-200/70"],
    ["bg-sky-100/75", "text-sky-700", "ring-sky-200/70"],
    ["bg-violet-100/75", "text-violet-700", "ring-violet-200/70"],
    ["bg-teal-100/75", "text-teal-700", "ring-teal-200/70"],
] as const;

const allCodeBadgeClasses = codeBadgePalettes.flat();

function setText(selector: string, value: unknown, unit = "") {
    const element = document.querySelector(selector);

    if (!element) return;

    const hasValue = value !== undefined && value !== null && value !== "" && value !== 0;
    const text = hasValue ? `${String(value)}${unit}` : "—";
    element.textContent = text;

    if (element instanceof HTMLElement && element.hasAttribute("data-copy")) {
        element.dataset.copyValue = hasValue ? text : "";
    }
}

function renderOptionalField(
    boxSelector: string,
    textSelector: string,
    value: unknown,
) {
    const box = document.querySelector<HTMLElement>(boxSelector);
    const textElement = document.querySelector(textSelector);

    if (!box) return;

    const hasValue = value !== undefined && value !== null && value !== "";
    box.hidden = !hasValue;

    if (hasValue && textElement) {
        textElement.textContent = String(value);
        box.dataset.copyValue = String(value);
    }
}

function updateCodeBadge(code: string | undefined) {
    const badge = document.querySelector<HTMLElement>("#modal-code");
    if (!badge) return;

    const value = code ?? "";
    const hash = [...value].reduce((total, character) => total + character.charCodeAt(0), 0);
    const palette = codeBadgePalettes[hash % codeBadgePalettes.length];

    badge.classList.remove(...allCodeBadgeClasses);
    badge.classList.add(...palette);
}

export function renderProductDetail(item: Product) {
    const image = document.querySelector<HTMLImageElement>("#modal-image");

    if (image) {
        image.src = item.image_url;
        image.alt = item.name ?? "产品图片";
    }

    setText("#modal-name", item.name);
    setText("#modal-code", item.code);
    updateCodeBadge(item.code);
    setText("#modal-supplier", item.supplier);
    setText("#modal-material-no", item.material_no);
    setText("#modal-capacity", item.capacity_ml);
    setText("#modal-capacity-oz", item.capacity_oz);
    setText("#modal-fiber-spec", item.fiber_spec, " mm");
    setText("#modal-fiber-count", item.fiber_count, " 根");
    setText("#modal-weight", item.weight_g, " g");
    setText("#modal-evaporation", item.evaporation_period);
    setText("#modal-mouth", item.mouth_spec);
    setText("#modal-size", item.dimensions);

    renderOptionalField("#modal-canton-box", "#modal-canton", item.canton_spec);
    renderOptionalField("#modal-history-box", "#modal-history", item.history_spec);
}
