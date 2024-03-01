// USe cookie / location to set the language

// Take the language from the navigator
let lang_support = ["en", "fr"];
var language = window.navigator.userLanguage || window.navigator.language;
// Remove the country code
language = language.split("-")[0];

if (!lang_support.includes(language)) {
    language = "en";
}

/**
 * Switch the language of the page to the one given in parameter
 * @param {HTMLElement} elt 
 */
function updateLanguage(elt){
    language = elt.value;
    switchLang();
    includeAllHTML();
    moveInputToFirstPosition(elt);
}

console.log("Language : " + language);

/**
 * Switch the language of the page
 */
function switchLang(){

    if (!lang_support.includes(language)) {
        language = "en";
    }

    console.log("Switching to " + language);

    let lst = document.querySelectorAll("[lang]");


    lst.forEach(elt => {
        if(elt.id =="curve"){
            chart.data.datasets[0].label = TRAD.curve.title[language];
            chart.options.scales.x.title.text = TRAD.curve.axeX[language];
            chart.options.scales.y.title.text = TRAD.curve.axeY[language];
            chart.update();
        }
        else{
            elt.innerText =  TRAD[elt.id][language];
            elt.lang = language;
        }
    });
    includeAllHTML();

}

/**
 * Include all html file in div with the attribute includeHTML
 */
function includeAllHTML(){
    console.log("includeAllHTML");
    let lst = document.querySelectorAll("[includeHTML]");
    lst.forEach(elt => {
        includeHTML(elt);
    })

}

/**
 * Include the html file in the div given in parameter
 * @param {HTMLElement} elmnt 
 */
function includeHTML(elmnt) {

    // suppr each child
    elmnt.childNodes.forEach(child => {
        elmnt.removeChild(child);
    });

    file = "html/" + language + "_" +  elmnt.getAttribute( "includeHTML");
    if (file) {
        /* Make an HTTP request using the attribute value as the file name: */
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
            if (this.status == 200) {elmnt.innerHTML = this.responseText;
            }
            if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
            }
        }
        xhttp.open("GET", file, true);
        xhttp.send();
        /* Exit the function: */
        return;
    }
}

const TRAD =  {
    "antSpeedLabel":{
        "en":"Ant Speed",
        "fr":"Vitesse des Fourmis"
    },
    "antSpacingLabel":{
        "en":"Ant Spacing",
        "fr":"Espacement des Fourmis"
    },
    "antPathLabel":{
        "en":"Ant path Selected",
        "fr":"Fourmi sélectionnée"
    },
    "obstacleSizeLabel":{
        "en": "Obstacle size",
        "fr": "Taille des obstacles"
    },

    "obstacleRandomPosLabel": {
        "en" : "Obstacle random position",
        "fr" : "Position aléatoire des obstacles"

    },

    "obstacleRandomSizeLabel": {
        "en" : "Obstacle random size",
        "fr" : "Tailles aléatoires des obstacles"
    },

    "stopButton":{
        "en":"Stop",
        "fr":"Arrêt"
    },
    "startButton":{
        "en":"Start",
        "fr":"Départ"
    },

    "resetButton":{
        "en":"Reset",
        "fr":"Réinitialisation"
    },
    "allPathButton":{
        "en":"All Path",
        "fr":"Tous"
    },
    "addObstacle":{
        "en":"Add obstacle",
        "fr":"Ajouter un obstacle"
    },
    "removeObstacle":{
        "en":"Remove obstacle",
        "fr":"Supprimer un obstacle"
    },



    "curve":{
        "title":{
            "en":"Path length of each ant",
            "fr":"Longueur du chemin de chaque fourmi"
        },
        "axeX":{
            "en":"Ant",
            "fr":"Fourmis"
        },
        "axeY":{
            "en":"Path length",
            "fr" : "Longueur du Chemin (UA)"
        }
    },
    "tutorialTab":{
        "en":"Tutorial",
        "fr":"Tutoriel"
    },
    "informationTab":{
        "en":"Information",
        "fr":"Information"
    },
    "aboutTab":{
        "en" : "More",
        "fr" : "Plus"
    },
    "curveTab":{
        "en" : "Curve",
        "fr" : "Courbe"
    },
    "alertPathTooShort":{
        "en" : "Path too short",
        "fr" : "Chemin trop court"
    }
}
;
