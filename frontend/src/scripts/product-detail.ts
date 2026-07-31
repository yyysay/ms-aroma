import {
    API_URL
} from "../lib/config";



function getImageUrl(
    imageUrl:string
){

    if(!imageUrl){

        return "";

    }


    return imageUrl.startsWith("http")
        ? imageUrl
        : `${API_URL}${imageUrl}`;

}





function setText(
    selector:string,
    value:any
){

    const element =
        document.querySelector(
            selector
        );


    if(!element){

        return;

    }


    element.textContent =
        value
        ? String(value)
        : "-";

}





export function renderProductDetail(
    item:any
){



    const image =
        document.querySelector(
            "#modal-image"
        ) as HTMLImageElement;



    if(image){

        image.src =
            getImageUrl(
                item.image_url
            );

    }





    setText(
        "#modal-name",
        item.name
    );


    setText(
        "#modal-code",
        item.code
    );


    setText(
        "#modal-supplier",
        item.supplier
    );


    setText(
        "#modal-material-no",
        item.material_no
    );


    setText(
        "#modal-capacity",
        item.capacity_ml
            ? `${item.capacity_ml} ml`
            : "-"
    );


    setText(
        "#modal-capacity-oz",
        item.capacity_oz
    );


    setText(
        "#modal-fiber-spec",
        item.fiber_spec
    );


    setText(
        "#modal-fiber-count",
        item.fiber_count
            ? `${item.fiber_count} 根`
            : "-"
    );


    setText(
        "#modal-weight",
        item.weight_g
            ? `${item.weight_g} g`
            : "-"
    );


    setText(
        "#modal-evaporation",
        item.evaporation_period
    );


    setText(
        "#modal-mouth",
        item.mouth_spec
    );


    setText(
        "#modal-size",
        item.dimensions
    );





    const cantonBox =
        document.querySelector(
            "#modal-canton-box"
        );


    const canton =
        document.querySelector(
            "#modal-canton"
        );



    if(item.canton_spec){


        cantonBox
            ?.classList.remove(
                "hidden"
            );


        if(canton){

            canton.textContent =
                item.canton_spec;

        }


    }else{


        cantonBox
            ?.classList.add(
                "hidden"
            );


    }





    const historyBox =
        document.querySelector(
            "#modal-history-box"
        );


    const history =
        document.querySelector(
            "#modal-history"
        );



    if(item.history_spec){


        historyBox
            ?.classList.remove(
                "hidden"
            );


        if(history){

            history.textContent =
                item.history_spec;

        }


    }else{


        historyBox
            ?.classList.add(
                "hidden"
            );


    }


}