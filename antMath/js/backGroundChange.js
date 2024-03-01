let previousOption = "grass"; // Variable pour stocker l'option précédente
let personalizedChoice = false;

function changeBackground(elt){
    console.log("elt.value", elt.value);
   
    switch (elt.value) {
        case "grass":
            previousOption = "grass";
            path = "./img/background/ground3.jpg";
            document.body.style.backgroundImage = "url('" + path + "')";
            moveInputToFirstPosition(elt);
            break;
        case "sand":
            previousOption = "sand";
            path = "./img/background/ground2.jpg";
            document.body.style.backgroundImage = "url('" + path + "')";
            moveInputToFirstPosition(elt);
            break;
        case "dirt":
            previousOption = "dirt";
            path = "./img/background/ground.jpg";
            document.body.style.backgroundImage = "url('" + path + "')";
            moveInputToFirstPosition(elt);
            break;
        case "personalized":
            // For the moment, consider the option selected is the previous one
            // let previousOptionElement = document.querySelector("option[value=" + previousOption + "]");
            // previousOptionElement.selected = true;
            // console.log("previousOptionElement selected=true", previousOption);
            // let optionPerso = document.querySelector("option[value=personalized]");
            // optionPerso.selected = false;
            // console.log("optionPerso : selected=false", optionPerso);

            let inputFile = document.getElementById("backgroundPickerPersonalized");
            inputFile.click();
            break;
        default:
            previousOption = "grass";
            // console.log("default");
            path = "./img/background/ground3.jpg";
            document.body.style.backgroundImage = "url('" + path + "')";
            
            break;
    }
}

/**
 * When the user select a file for the background by clicking on the hidden input button #backgroundPickerPersonalized
 * @param {HTMLElement} elt 
 */
function onInputBackgroundInput(elt){



    const selectedFile = elt.files[0];
    if (selectedFile) {     

        let img = new Image();
        img.src = URL.createObjectURL(selectedFile);

        // If we want to resize the image
        
        // console.log("img.src", img.src);
        // img.onload = function() {
        //     // Récupérer les dimensions de l'image
        //     let imgWidth = img.width;
        //     let imgHeight = img.height;
        //     console.log("imgWidth", imgWidth);
        //     console.log("imgHeight", imgHeight);
        // }


        document.body.style.backgroundImage = "url('" + img.src + "')";

        
        moveInputToFirstPosition(document.getElementById("choiceBackgroundPersonalized"));


    }
}

/**
 * Permet de mettre la vignette de l'option sélectionnée en premier
 * Required format : <div><label></label><input></div>
 * @param {HTMLElement} inputElement 
 */
function moveInputToFirstPosition(inputElement) {
    // console.log("moveInputToFirstPosition =============================");

    let parentDiv = inputElement.parentElement;
    let labelElement = inputElement.nextElementSibling;
    // console.log("labelElement", labelElement);
    // console.log("parentDiv", parentDiv);

    // console.log("parentDiv.firstChild", parentDiv.firstChild);
    parentDiv.insertBefore(labelElement, parentDiv.firstChild);
    // console.log("parentDiv.firstChild", parentDiv.firstChild);
    parentDiv.insertBefore(inputElement, parentDiv.firstChild);
  }