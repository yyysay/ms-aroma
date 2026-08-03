function getImageUrl(
    imageUrl:string
){

    if (!imageUrl) {
        return "";
    }

    return imageUrl;

}

/* 处理传参 */
function setText(
    selector: string,
    value: any,
    unit: string = "" // 可选的单位参数，默认空
) {
    const element = document.querySelector(selector);

    if (!element) {
        return;
    }

    element.textContent =
        value
        ? `${value}${unit}`
        : "/";
}

// 按需自动隐藏
// 这里需要在 html 结构定义两个 id , *-box: 为外层 *: 为内层
/*
<div id="modal-canton-box">
    <span>广交会规格</span>
    <span id="modal-canton"></span>
</div>
*/
function renderOptionalField(
    boxSelector: string,
    textSelector: string,
    value: any
) {
    const box = document.querySelector(boxSelector);
    const textElement = document.querySelector(textSelector);

    if (!box) return;

    if (value) {
        box.classList.remove("hidden");
        if (textElement) {
            textElement.textContent = String(value);
        }
    } else {
        box.classList.add("hidden");
    }
}

// 主函数
export function renderProductDetail(
    item: any
){

    const image =
        document.querySelector(
            "#modal-image"
        ) as HTMLImageElement;

    if (image) {
        image.src =
            getImageUrl(
                item.image_url
            );
    }

    setText("#modal-name", item.name);
    setText("#modal-code", item.code);

    setText("#modal-supplier", item.supplier);
    setText("#modal-material-no", item.material_no);
    setText("#modal-capacity", item.capacity_ml);
    setText("#modal-capacity-oz", item.capacity_oz);
    setText("#modal-fiber-spec", item.fiber_spec, "mm");
    setText("#modal-fiber-count", item.fiber_count, "根");
    setText("#modal-weight", item.weight_g, "g");
    setText("#modal-evaporation", item.evaporation_period);
    setText("#modal-mouth", item.mouth_spec);
    setText("#modal-size", item.dimensions);
    
    renderOptionalField("#modal-canton-box", "#modal-canton", item.canton_spec);
    renderOptionalField("#modal-history-box", "#modal-history", item.history_spec);

}
