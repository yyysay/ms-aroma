export function initSearch(){


const input =
document.querySelector(
"#search-input"
);



const cards =
document.querySelectorAll(
".product-card"
);



input?.addEventListener(
"input",
(event)=>{


const keyword =
(event.target as HTMLInputElement)
.value
.toLowerCase()
.trim();



cards.forEach(card=>{


const text =
card
.getAttribute(
"data-search"
)
?.toLowerCase()
?? "";



(card as HTMLElement)
.style.display =
text.includes(keyword)
?""
:"none";


});


});


}