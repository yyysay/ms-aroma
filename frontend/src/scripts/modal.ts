import {
    renderProductDetail
} from "./product-detail";



export function initModal() {


    console.log(
        "initModal loaded"
    );





    function closeModal(){

        document
            .querySelector(
                "#product-modal"
            )
            ?.classList.add(
                "hidden"
            );

    }





    function showProduct(
        card:HTMLElement
    ){


        console.log(
            "showProduct",
            card
        );



        const raw =
            card.dataset.product;



        if(!raw){

            console.error(
                "missing product data"
            );

            return;

        }



        const item =
            JSON.parse(
                decodeURIComponent(
                    raw
                )
            );



        console.log(
            "item",
            item
        );





        const modal =
            document.querySelector(
                "#product-modal"
            );



        if(!modal){

            console.error(
                "modal not found"
            );

            return;

        }





        renderProductDetail(
            item
        );





        modal.classList.remove(
            "hidden"
        );


    }





    /*
        商品点击事件委托
    */

    document.addEventListener(
        "click",
        (event)=>{


            const target =
                event.target as HTMLElement;



            const card =
                target.closest(
                    ".product-card"
                );



            if(!card){

                return;

            }



            showProduct(
                card as HTMLElement
            );


        }
    );





    /*
        关闭按钮
    */

    document
        .querySelector(
            "#modal-close"
        )
        ?.addEventListener(
            "click",
            ()=>{

                closeModal();

            }
        );





    /*
        点击遮罩关闭
    */

    document
        .querySelector(
            "#product-modal"
        )
        ?.addEventListener(
            "click",
            (event)=>{


                if(
                    event.target ===
                    event.currentTarget
                ){

                    closeModal();

                }


            }
        );





    /*
        ESC关闭
    */

    document.addEventListener(
        "keydown",
        (event)=>{


            if(
                event.key === "Escape"
            ){

                closeModal();

            }


        }
    );





    /*
        点击其他区域关闭
    */

    document.addEventListener(
        "click",
        (event)=>{


            const modal =
                document.querySelector(
                    "#product-modal"
                );



            if(!modal){

                return;

            }



            if(
                modal.classList.contains(
                    "hidden"
                )
            ){

                return;

            }



            const target =
                event.target as HTMLElement;



            const modalContent =
                target.closest(
                    "#product-modal section"
                );



            const productCard =
                target.closest(
                    ".product-card"
                );



            if(
                !modalContent &&
                !productCard
            ){

                closeModal();

            }


        }
    );


}