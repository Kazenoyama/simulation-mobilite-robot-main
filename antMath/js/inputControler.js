/**
 * Hide / Show the display control panel
 */
function displayControlPanel() {
    let controlPanel = document.getElementById("controlPanel");
    controlPanel.style.display = (controlPanel.style.display == "flex") ? "none" : "flex";

    let iconBar_buttonDiv = document.getElementById("iconBar-buttonDiv");
        iconBar_buttonDiv.style.display = (iconBar_buttonDiv.style.display == "flex") ? "none" : "flex";
}

//Change the space between two ants with html
function changeAntSpacing(element) {
    spacingAnt = parseInt(element.value);
}

//Change the execution speed with html
function changeAntSpeed() {
    speedAnt = Math.abs(parseInt(document.getElementById('antSpeed').value));
}

//Reset the simulation with html
function resetDraw(element) {
    location.reload();
}
function pauseDraw(element) {
    if (isGameStopped) {
        isGameStopped = false;
        document.getElementById('stopButton').innerText = TRAD.stopButton[language];
        setTimeout(startAnts, 10, firstAnt, d, firstX, firstY);
    }
    else {
        isGameStopped = true;
        document.getElementById('stopButton').innerText = TRAD.startButton[language];
    }
}
function drawPath(element) {
    
    for (var i_1 = 0; i_1 < canvasTab.length; i_1++) {
        canvasTab[i_1].style.opacity = '0';

    }
    if (canvasTab.length > 0 && parseInt(element.value) >= 0) {
        canvasTab[parseInt(element.value)].style.opacity = '1';
    }
}
function drawMainPaths(element) {
    drawAllPathOn = !drawAllPathOn;
    for (var i_2 = 0; i_2 < canvasTab.length; i_2++) {
        canvasTab[i_2].style.opacity = '0';
    }
    if (drawAllPathOn) {
        for (var i_3 = 0; i_3 < canvasTab.length; i_3++) {
            canvasTab[i_3].style.opacity = '1';
        }
    }
}
function drawAllPaths(element) {
    
    let limite = (canvasTab.length < 1000) ? canvasTab.length : 1000;

    for (var i_4 = 0; i_4 < limite; i_4++) {
        canvasTab[i_4].style.opacity = '0';

    }
    if (element.checked) {
        document.getElementById('drawMain').checked = false;
        for (var i_5 = 0; i_5 < limite; i_5++) {
            canvasTab[i_5].style.opacity = '1';
        }
    }
}


function createGIF() {
   
    var gif = new GIF({
        workerScript: './library/gif.js.optimized/dist/gif.worker.js',
        workers: navigator.hardwareConcurrency,
        quality: 100,
        transparent: "#0x00FF00"
    });

    var canvasFinal = document.createElement('canvas');

    let originalCanvas = document.getElementById("playGround");

    canvasFinal.width = originalCanvas.width;
    canvasFinal.height = originalCanvas.height;

    // Get the background image of the body
    var bodyBackgroundImage = getComputedStyle(document.body).backgroundImage;

    // Load the background image
    var bgImage = new Image();
    bgImage.onload = function () {
        canvasFinal.getContext('2d').drawImage(bgImage, 0, 0, canvasFinal.width, canvasFinal.height);
        addFramesToGif(gif, canvasFinal);
    };
    
    // Extract the URL from the background image property (removing quotes if present)
    var bgImageUrl = bodyBackgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
    bgImage.src = bgImageUrl;

    function addFramesToGif(gif, canvas) {
        gif.addFrame(canvas, { delay: 200 });
        for (var i_9 = 0; i_9 < canvasTab.length; i_9++) {
            canvas.getContext('2d').drawImage(canvasTab[i_9], 0, 0);
            gif.addFrame(canvas, {
                delay: Math.max(40, 200 - 10 * i_9),
                copy: true
            });
        }
        gifRender(gif);
    }

    function gifRender(gif) {
        var load;
        var loader;
        var text;

        // Arrêt le temps de la génération du GIF
        if(!isGameStopped){
            document.getElementById('stopButton').click();
        }

        // Init the GIF
        gif.on('start', function (p) {
            loader = document.createElement('div');
            text = document.createElement('span');

            // Division de chargement
            loader.style.textAlign = 'center';
            loader.style.position = 'absolute';
            loader.style.transform = 'translateX(' + -50 + '%) translateY(' + -50 + '%)';
            loader.style.top = '50%';
            loader.style.left = '50%';
            loader.style.zIndex = '1000';
            loader.style.rotate = '0';

            // Texte de chargement
            text.style.position = 'absolute';
            text.style.left = '50%';
            text.style.top = '50%';
            text.style.transform = 'translateX(-50%) translateY(-50%)';
            // text.style.backgroundColor = 'rgb(255,255,255)';
            text.style.backgroundColor = 'none';
            text.style.fontSize = '30px';

            // Image de chargement
            load = document.createElement('img');
            load.src = "./assets/loading.svg";
            load.style.width = 100 + 'px';
            load.style.height = 100 + 'px';
            load.style.display = 'block';

            loader.appendChild(text);
            loader.appendChild(load);
            document.getElementById("playPanel").appendChild(loader);
            console.log(loader)
        });

        gif.on('progress', function (p) {
            text.innerText = Math.round(p * 100) + '%';
        });

        gif.on('finished', function (blob) {
            console.log("onfFinish");
            document.getElementById("playPanel").removeChild(loader);
            window.open(URL.createObjectURL(blob));
            // Relance après la génération du GIF
            document.getElementById('stopButton').click();
            
        });

        gif.render();
        
    }
}


