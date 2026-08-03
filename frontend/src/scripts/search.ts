export function initSearch() {
    const inputs = document.querySelectorAll<HTMLInputElement>(".product-search");
    const cards = document.querySelectorAll<HTMLElement>(".product-card");
    const resultCounts = document.querySelectorAll("[data-result-count]");
    const emptyState = document.querySelector<HTMLElement>("#empty-state");

    if (inputs.length === 0) return;

    const applySearch = (value: string, activeInput: HTMLInputElement) => {
        inputs.forEach((input) => {
            if (input !== activeInput) input.value = value;
        });

        const keywords = value
            .toLocaleLowerCase("zh-CN")
            .trim()
            .split(/\s+/)
            .filter(Boolean);
        let visibleCount = 0;

        cards.forEach((card) => {
            const searchableText = (card.dataset.search ?? "")
                .toLocaleLowerCase("zh-CN");
            const matches = keywords.every((keyword) => searchableText.includes(keyword));

            card.hidden = !matches;
            if (matches) visibleCount += 1;
        });

        resultCounts.forEach((element) => {
            element.textContent = String(visibleCount);
        });

        if (emptyState) emptyState.hidden = visibleCount !== 0;
    };

    inputs.forEach((input) => {
        input.addEventListener("input", () => applySearch(input.value, input));
    });
}
