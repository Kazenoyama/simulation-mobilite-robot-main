
var firstAnt = new Ant('./assets/ant.png', 30, 30);

/**
 * Array containing all the ants
 * @type {Array<DrawingAnt>}
 */
var futurAnts = new Array();

/**
 * Equal waiting for the user to draw a path
 * @type {boolean}
 */
var draw = true;

/**
 * Space between two ants
 */
var spacingAnt = 30;

/**
 * Speed of the ants
 */
var speedAnt = 1;

/**
 * DrawingApp object
 * ????
 * @type {DrawingApp}
 */
var d;

/**
 * Chart object
 * Save me data for ther curv, ect...
 * @type {Chart}
 */
var chart;

/**
 * Nombre d'exécution de la fonction delayFirst avant de dessiner un nouveau path
 * Je crois ???
 * On augmente sa value expodentiellement pour pas avoir 1 millions de chemins quand les tracets sont quasi identiques
 * @type {number}
 */
let drawingGap = 4;

/**
 * Compteur du drawing spacingAnt
 * Je sais pas à quoi ça correspond exactement : le nombre de chemin dessiner ??
 * Pourquoi commence à 2 ??
 * @type {number}
 */
let compter = 2;

var canvasTab = new Array();
var isGameStopped = false;
var firstX;
var firstY;

// RGB : Color of the path draw by the ants
var pathColorRedValue = 255;
var pathColorBlueValue = 0;
var pathColorGreenValue = 0;

// Allow use button instead of checkbox
let drawAllPathOn = true;

let saveFirstDrawApp = Object();

/**
 * Say if the path has be draw vertically or horizontally
 * @type {boolean}
 */
let orientationDrawVertical;

///////////////////////////////////////////
// Obstacles
var obstacleManager;
var end;
var start;

//A etoile
var algoAetoile;
var endPoint;
var startPoint;
var exploredPoint = [];
var unexploredPoint = [];
var animationFrame;
var stop = false;
var shortestPath = [];

var fireAetoile = false;

var algoAetoiles = [];

///////////////////////////////////////////

///////////////////////////////////////////
// New methode of genearting path to have a better environement for the ants
var newMethod = false;
var numberOfPath = 20;

var allPath = [];
var replayPath = [];

var futureAntsDiffrentPath = [];
var contain = false;
var canReplay = false;

///////////////////////////////////////////



/**
 * Handle the draw of the path made by the user on click / touch screen
 */
function drawHandler() {

    // Check if there is a distance > 100px between the first and another point
    let pathTooshort = true;
    // Si au moins 1 point est suffisament loin, pathTooshort = false
    for (let i = 1; i < d.clickX.length; i++) {
        let dist = Math.sqrt((d.clickX[0] - d.clickX[i]) ** 2 + (d.clickY[0] - d.clickY[i]) ** 2);
        if (dist > 100) {
            pathTooshort = false;
            break;
        }
    }
    // Si path trop court, on alerte et on ne dessine pas
    if (pathTooshort) {
        //alert(TRAD.alertPathTooShort[language]);
        d.clearCanvas();
        return;
    }
    // Si path assez long, on dessine
    else if (draw) {
        draw = false;
        obstacleManager = d.getObstaclesManager();
        end = { x: d.clickX[d.clickX.length - 1], y: d.clickY[d.clickY.length - 1] };
        start = { x: d.clickX[0], y: d.clickY[0] };

        orientationDrawVertical = (window.innerHeight > window.innerWidth) ? true : false;

        //add the first ant at the begining and on the page
        firstAnt.move(d.clickX[0], d.clickY[0]);
        document.getElementById("playPanel").appendChild(firstAnt.img);
        //Save the first location
        firstX = d.clickX[0];
        firstY = d.clickY[0];
        //Print the anthill
        var anthill = new Ant('./img/fourmiliere_cut.png', 50, 50);
        anthill.move(firstX, firstY);

        document.getElementById("playPanel").appendChild(anthill.img);
        //init array containing all the ants
        futurAnts = new Array();
        //start main prg, with the speed choosen by the user
        // saveFirstDrawApp.context = context;

        if(newMethod){
            console.log("Logic for the new method");
            //console.log(d.getObstaclesManager().obstacles);
            methodeDeux();

        }
        else{setTimeout(startAnts, 10, firstAnt, d, firstX, firstY);}

        
    }
}

function methodeDeux(){
    contain = true;
    for(var i = 0; i < algoAetoile.allPoints.length; i++){
        for(j = 0; j < algoAetoile.allPoints[i].length; j++){
            var distance = Math.sqrt(Math.pow(algoAetoile.allPoints[i][j].x - start.x, 2) + Math.pow(algoAetoile.allPoints[i][j].y - start.y, 2));
            var distance2 = Math.sqrt(Math.pow(algoAetoile.allPoints[i][j].x - end.x, 2) + Math.pow(algoAetoile.allPoints[i][j].y - end.y, 2));
            if(distance < 15 && algoAetoile.allPoints[i][j].isInObstacle == false){
                startPoint = algoAetoile.allPoints[i][j];
            }

            if(distance2 < 15 && algoAetoile.allPoints[i][j].isInObstacle == false){
                endPoint = algoAetoile.allPoints[i][j];
            }
        }
    }
    
    for(var i=0; i < numberOfPath; i++){
        var a = new Setup(d.canvas.width,d.canvas.height, startPoint, endPoint,d.canvas.getContext('2d'));
        a.setupAndGenerate(d.getObstaclesManager().obstacles);
        algoAetoiles.push(a);
    }

    for(var i = 0; i < algoAetoiles.length; i++){
        algoAetoiles[i].run();
    }

    var interval = setInterval(function(){
        var allDone = false;
        var numberDone = 0;
        for(var i=0; i < algoAetoiles.length; i++){
            if(algoAetoiles[i].stopIntervale){
                numberDone++;
            }

            if(numberDone == algoAetoiles.length){
                allDone = true;
            }

            if(allDone){
                clearInterval(interval);
                for(var i=0; i < algoAetoiles.length; i++){
                    algoAetoiles[i].drawOnePath();
                    allPath.push(algoAetoiles[i].onePath);
                    replayPath.push([]);
                    futureAntsDiffrentPath.push([]);
                }
                console.log("allPath", allPath[0]);
                console.log("replayPath", replayPath[0]);
                startAntsMethodeDeux();
            }
        }
    },1000);
   

}

window.onload = function () {

    previousOrientation = getOrientation();

    //create canvas and set background
    d = new DrawingApp();
    algoAetoile = new Setup(d.canvas.width,d.canvas.height);
    algoAetoile.listePoint();

    ///////////////////////////
    //always get the new obstacles
    var addObs = document.getElementById("addObstacle");
    addObs.addEventListener("click", function () {
        obstacleManager = d.getObstaclesManager();
        allFalse();
        updatePointObstacle();
        //console.log("getObstacleManager", obstacleManager);
    });

    var removeObs = document.getElementById("removeObstacle");
    removeObs.addEventListener("click", function () {
        obstacleManager = d.getObstaclesManager();
        allFalse();
        updatePointObstacle();
        //console.log("getObstacleManager", obstacleManager);
    });
    ///////////////////////////

    //////////////////////////
    //add a listener to the checkbox
    var randoSize = document.getElementById("obstacleRandomSize");
    randoSize.addEventListener("change", function(){
        if(randoSize.checked){
            randoSize.value = 1;
        }
        else{randoSize.value = 0;}
    })

    var randoPos = document.getElementById("obstacleRandomPos")
    randoPos.addEventListener("change", function(){
        if(randoPos.checked){
            randoPos.value = 1;
        }
        else{randoPos.value = 0;}
    })

    //creation of the chart
    var canvasCurve = document.getElementById('curve');
    chart = new Chart(canvasCurve.getContext('2d'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                backgroundColor: [
                    'rgba(0, 0, 0)'
                ],
                label: 'Path length of each ant',
                data: []
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 1 | 2,
            tension: 0.4,
            pointRadius: 2,
            pointBackgroundColor: 'rgba(255,0,0,1)',
            pointBorderColor: 'rgba(0,0,0,1)',
            borderColor: 'rgb(0,0,0,1)',

            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Ant"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Path length (AU)' // Arbitrary Unit
                    },
                    min: 0
                },
            },
            animation: {
                duration: 0
            }
        }
    });

    // saveFirstDrawApp = new DrawingApp();
    Object.assign(saveFirstDrawApp, d);
    saveFirstDrawApp.redraw = d.redraw;

    // TWO handlers : one for PC, one for smartphone

    //detect click on canvas once
    document.getElementById("playGround").addEventListener('click', function (event) {
        drawHandler();
    });
    // For smartphone : detect release of finger on canvas once
    document.getElementById("playGround").addEventListener('touchend', function (event) {
        drawHandler();
    });


    // //Re Set la valeur de speed/spacingAnt value par défaut au chargement pour être égale à celle du curseur

    let speedInput = document.getElementById('antSpeed');
    speedInput.value = defaultValueRange(speedInput);
    changeAntSpeed(speedInput);

    let gapInput = document.getElementById("antSpacing");
    gapInput.value = defaultValueRange(gapInput);
    changeAntSpacing(gapInput);

    // Pas touche au path selection 

    // showHideDataViewer();
    switchLang();
    includeAllHTML();
    document.querySelector("[value=" + language + "]").selected = true;

    handleSize();
};

function defaultValueRange(element) {
    return Math.round((element.max < element.min) ? element.min : Number(element.min) + ((element.max - element.min) / 2))
}

/**
 * Function to make appear / desapppear the data viewer div
 */
function showHideDataViewer() {
    let curve = document.getElementById("curve");

    // hasChildren ne marche pas -> renvoie toujours true
    if (window.innerWidth < 900 && document.querySelector(".tab__content:last-child").children.length == 0) {

        curve.remove();
        document.querySelector(".tab__content:last-child").appendChild(curve);

    }
    if (window.innerWidth >= 900 && document.querySelector(".tab__content:last-child").children.length != 0) {
        // graph.remove();
        // document.getElementById("controlPanel").appendChild(graph);
        curve.remove();
        document.getElementById("dataViewer").appendChild(curve);
        document.getElementById("tab1").checked = true;
    }

}
let previousOrientation;

function getOrientation() {
    return window.matchMedia("(orientation: landscape)").matches ? 'landscape' : 'portrait';
}

function handleSize(){
    const currentOrientation = getOrientation();

    // showHideDataViewer();

    // this listener has been made to replaced the CSS that does'not work
    // le canvas doit être entièremenet reconstuit pour évider de graphiquement disparaitre
    if (window.innerWidth >= 900) {
        let controlPanel = document.getElementById("controlPanel");
        if (controlPanel.style.display != "block") {
            controlPanel.style.display = "block";
        }
        let iconBar_buttonDiv = document.getElementById("iconBar-buttonDiv");
        iconBar_buttonDiv.style.display = "contents";

        // hamburger input
        let hamburgerInput = document.querySelector(".checkbox");
        hamburgerInput.checked = false;
    }

    if(window.innerWidth <= 900){
        let iconBar_buttonDiv = document.getElementById("iconBar-buttonDiv");
        iconBar_buttonDiv.style.display = "none";

        let controlPanel = document.getElementById("controlPanel");
        controlPanel.style.display = "none";
    }

    let playPanel = document.getElementById("playPanel");
    let playGround = document.getElementById("playGround");

    if (!draw) { // si le chemin est tracé
        if (previousOrientation != currentOrientation && window.innerWidth < 900 ) { // et sur smartphone

            // l'orienté en fonction de la rotation
            playPanel.style.transformOrigin = playGround.height / 2 + "px " + playGround.height / 2 + "px";
            if (window.innerWidth < window.innerHeight) {

                playPanel.style.rotate = orientationDrawVertical ? "0deg" : "90deg";
            }
            else {
                playPanel.style.rotate = orientationDrawVertical ? "90deg" : "0deg";
            }
        }
    }
    else {
        // Resize le canvas pour qu'il prenne toute la place
        playGround.width = window.innerWidth;
        playGround.height = window.innerHeight;
    }

    // // redessine le chemin dans le canvas resized
    // // on doit redonné le contexte je sais pas pourquoi
    saveFirstDrawApp.context.strokeStyle = '#EE5A24';
    saveFirstDrawApp.context.lineCap = 'round';
    saveFirstDrawApp.context.lineJoin = 'round';
    saveFirstDrawApp.context.strokeStyle = '#EE5A24';

    saveFirstDrawApp.context.lineWidth = 4;
    saveFirstDrawApp.redraw();

    previousOrientation = currentOrientation;
}

window.addEventListener("resize", () => {

    handleSize();

});

// évite d'afficher 1 millipns de path qaund différence minime
let previousPathLength = Infinity;
let deltaPathLength = Infinity;
const DELTA_MIN = 0.002;

/**
 * 
 * @param {Ant} First First ant of the queue
 * @param {DrawingApp} Space The curb 
 * @param {number} firstX coord of thestart of  path 
 * @param {number} firstY coord of thestart of  path
 */
function startAnts(First, Space, firstX, firstY) {

    //create an ant if none are left
    if (futurAnts.length == 0) {

        futurAnts.push(new DrawingAnt('./assets/RedAnt.png', 30, 30, true));
        futurAnts[futurAnts.length - 1].move(firstX, firstY);
        document.getElementById("playPanel").appendChild(futurAnts[futurAnts.length - 1].img);

    }
    //While the first ant is still mooving
    if (Space.clickX.length > 0) {
        if (Space.clickX.length == 1) {
            delayFirst(Space, First, firstX, firstY);
            //change the first ant in food at the end and add the lenght of its path
            if (!(Math.abs(First.x - Space.clickX[0]) > 1 && Math.abs(First.y - Space.clickY[0]) > 1)) {
                Space.removeFirstOne();
                // First.img.src = './assets/strawberry.png';
                First.img.src = './img/fraise_trans.png';
                First.img.style.width = 80 + 'px';
                First.img.style.height = 80 + 'px';
                First.img.style.transform = 'translateX(' + -50 + '%) translateY(' + -50 + '%) rotate(' + (0) + 'deg) ';
                updateSample(First.distance);

                // évite d'afficher 1 millipns de path qaund différence minime
                deltaPathLength = previousPathLength - First.distance;

            }
        }
        else {
            delayFirst(Space, firstAnt, firstX, firstY);
            if (!(Math.abs(First.x - Space.clickX[0]) > 1 && Math.abs(First.y - Space.clickY[0]) > 1)) {
                Space.removeFirstOne();
            }
        }
        //Once the first ant stopped, run forever
    }
    else {
        if(futurAnts[0].direct){
            followShortestPath(futurAnts[0]);
        }
        else{
            //new first follow the never changing First with special function with no slow
            futurAnts[0].followEnd(First,obstacleManager,end);
        }
        //add a new ant every time the last one is farther than 'spacingAnt'
        if (Math.sqrt((futurAnts[futurAnts.length - 1].x - firstX) * (futurAnts[futurAnts.length - 1].x - firstX) + (futurAnts[futurAnts.length - 1].y - firstY) * (futurAnts[futurAnts.length - 1].y - firstY)) > spacingAnt) {
            if (compter == drawingGap) {
                if (pathColorRedValue > 0) {
                    pathColorBlueValue = Math.min(255, pathColorBlueValue + 45);
                }
                else {
                    pathColorBlueValue = Math.max(0, pathColorBlueValue - 45);
                    pathColorGreenValue = Math.min(255, pathColorGreenValue + 45);
                }
                pathColorRedValue = Math.max(0, pathColorRedValue - 45);

                // compter = 2;
                drawingGap = Math.round(drawingGap * 2 - drawingGap / 2);

                if(fireAetoile){
                    futurAnts.push(new DirectAnt('./assets/buttonInfo.png', 30, 30, false));
                    shortestPath = [];
                    exploredPoint = [];
                    unexploredPoint = [];
                    resetallCost();
                    if(unexploredPoint.length <= 0){
                        for(var i = 0; i < algoAetoile.allPoints.length; i++){
                            for(j = 0; j < algoAetoile.allPoints[i].length; j++){
                                var distance = Math.sqrt(Math.pow(algoAetoile.allPoints[i][j].x - start.x, 2) + Math.pow(algoAetoile.allPoints[i][j].y - start.y, 2));
                                var distance2 = Math.sqrt(Math.pow(algoAetoile.allPoints[i][j].x - end.x, 2) + Math.pow(algoAetoile.allPoints[i][j].y - end.y, 2));
                                if(distance < 15 && algoAetoile.allPoints[i][j].isInObstacle == false){
                                    startPoint = algoAetoile.allPoints[i][j];
                                }

                                if(distance2 < 15 && algoAetoile.allPoints[i][j].isInObstacle == false){
                                    endPoint = algoAetoile.allPoints[i][j];
                                }
                            }
                        }
                        unexploredPoint.push(startPoint);}
                    stop = false;
                    d.clearCanvas();
                    pauseDraw();
                    allFalse();
                    updatePointObstacle();
                    seekShortestPath();
                    fireAetoile = false;
                }
                else{
                    if (drawAllPathOn) {
                        // if (document.getElementById('drawMain').checked) {
                        futurAnts.push(new DrawingAnt('./assets/RedAnt.png', 30, 30, true));
                    }
                    else {
                        futurAnts.push(new DrawingAnt('./assets/RedAnt.png', 30, 30, false));
                    }
                }
                futurAnts[futurAnts.length - 1].move(firstX, firstY);
                document.getElementById("playPanel").appendChild(futurAnts[futurAnts.length - 1].img);
            }
            else {
                futurAnts.push(new DrawingAnt('./assets/ant.png', 30, 30, false));
                futurAnts[futurAnts.length - 1].move(firstX, firstY);
                document.getElementById("playPanel").appendChild(futurAnts[futurAnts.length - 1].img);
            }
            compter++;
        }
        //if the first reached the end, add its distance to the curve then delete it from the array and the html
        if (futurAnts[0].x == First.x && futurAnts[0].y == First.y) {
            updateSample(futurAnts[0].distance);
            document.getElementById("playPanel").removeChild(futurAnts.shift().img);

            // évite d'afficher 1 millipns de path qaund différence minime
            // le undef est au cas où l'utilisteur créé un chmin si court que pas de futur ant


            deltaPathLength = previousPathLength - ((futurAnts[0] == undefined) ? 0 : futurAnts[0].distance);

        }
        //move all the other ants, from the closest to the farest
        for (var i_6 = 1; i_6 < futurAnts.length; i_6++) {
            if(futurAnts[i_6].direct){followShortestPath(futurAnts[i_6]);}
            else{
                futurAnts[i_6].follow(futurAnts[i_6 - 1],obstacleManager,end);
            }
        }
    }
    //repeat the function
    if (!isGameStopped) {
        setTimeout(startAnts, 10, firstAnt, Space, firstX, firstY);
    }


}

function delayFirst(Space, First, firstX, firstY) {
    //follow next point on the line
    First.followN(Space.clickX[0], Space.clickY[0]);
    //create a second ant to avoid bugs
    if (futurAnts.length == 0) {
        futurAnts.push(new DrawingAnt('./assets/RedAnt.png', 30, 30, true));
        futurAnts[futurAnts.length - 1].move(firstX, firstY);
        document.getElementById("playPanel").appendChild(futurAnts[futurAnts.length - 1].img);
        //create new ants
    }
    else if (Math.sqrt((futurAnts[futurAnts.length - 1].x - firstX) * (futurAnts[futurAnts.length - 1].x - firstX) + (futurAnts[futurAnts.length - 1].y - firstY) * (futurAnts[futurAnts.length - 1].y - firstY)) > spacingAnt) {
        if (compter == drawingGap) {
            if (pathColorRedValue > 0) {
                pathColorBlueValue = Math.min(255, pathColorBlueValue + 45);
            }
            else {
                pathColorBlueValue = Math.max(0, pathColorBlueValue - 45);
                pathColorGreenValue = Math.min(255, pathColorGreenValue + 45);
            }
            pathColorRedValue = Math.max(0, pathColorRedValue - 45);

            // compter = 0;
            // On augmente le drawing spacingAnt expodentiellement pour pas avoir 1 millions de chemins quand les tracets sont quasi identiques
            drawingGap = Math.round(drawingGap * 2 - drawingGap / 2);

            // if(drawAllPathOn){
            // if (drawAllPathOn && (deltaPathLength > DELTA_MIN || deltaPathLength < 0)) {
            if (drawAllPathOn ) {
                // if (document.getElementById('drawMain').checked) {
                futurAnts.push(new DrawingAnt('./assets/RedAnt.png', 30, 30, true));
            }
            else {
                futurAnts.push(new DrawingAnt('./assets/RedAnt.png', 30, 30, false));
            }
            futurAnts[futurAnts.length - 1].move(firstX, firstY);
            document.getElementById("playPanel").appendChild(futurAnts[futurAnts.length - 1].img);
        }
        else {
            futurAnts.push(new DrawingAnt('./assets/ant.png', 30, 30, false));
            futurAnts[futurAnts.length - 1].move(firstX, firstY);
            document.getElementById("playPanel").appendChild(futurAnts[futurAnts.length - 1].img);
        }
        compter++;
    }
    //make other ants follow the first
    if(futurAnts[0].direct){followShortestPath(futurAnts[0]);}
    else{futurAnts[0].follow(First,obstacleManager,end);}
    
    for (var i_7 = 1; i_7 < futurAnts.length; i_7++) {
        if(futurAnts[i_7].direct){followShortestPath(futurAnts[i_7]);}
        else{futurAnts[i_7].follow(futurAnts[i_7 - 1],obstacleManager,end);}
    }
}

function startAntsMethodeDeux() {
    
    for(var i= 0; i < futureAntsDiffrentPath.length; i++){

        //create an ant if none are left in the different path

        departX = allPath[i][allPath[i].length-1].x;
        departY = allPath[i][allPath[i].length-1].y;
        if(futureAntsDiffrentPath[i].length == 0){
            console.log("New ants added");
            futureAntsDiffrentPath[i].push(new DrawingAnt('./assets/RedAnt.png', 30,30,true));
            futureAntsDiffrentPath[i][futureAntsDiffrentPath[i].length - 1].move(departX,departY);
            document.getElementById("playPanel").appendChild(futureAntsDiffrentPath[i][futureAntsDiffrentPath[i].length - 1].img);

        }
    }

    console.log("futureAntsDiffrentPath", futureAntsDiffrentPath.length);
    console.log("allPath", allPath.length);
    playAnts();
}

function playAnts(){
    var done;

    var testRun = setInterval(function(){
        done = 0;
        for(var i =0; i < futureAntsDiffrentPath.length; i++){
            for(var j=0; j < futureAntsDiffrentPath[i].length; j++){
                for(var pathToTake=0; pathToTake < allPath.length; pathToTake++){
                    if( i == pathToTake){
                        
                        if(followPath(futureAntsDiffrentPath[i][j],pathToTake) && !futureAntsDiffrentPath[i][j].done){
                            futureAntsDiffrentPath[i][j].done = true;
                            futureAntsDiffrentPath[i][j].img.src = './img/fraise_trans.png';
                            futureAntsDiffrentPath[i][j].img.style.width = 80 + 'px';
                            futureAntsDiffrentPath[i][j].img.style.height = 80 + 'px';
                            futureAntsDiffrentPath[i][j].img.style.transform = 'translateX(' + -50 + '%) translateY(' + -50 + '%) rotate(' + (0) + 'deg) ';
                            updateSample(futureAntsDiffrentPath[i][j].distance);
                            futureAntsDiffrentPath[i].shift();
                        };
                    }

                }
            }
            if(futureAntsDiffrentPath[i].length == 0){
                done++;
            }
        }

        if(done == futureAntsDiffrentPath.length){
            clearInterval(testRun);
            canReplay = true;
            console.log("All ants are done");
            //console.log("replayPath", replayPath);
            //console.log(futureAntsDiffrentPath);
        }

    }, 10);
}


function followPath(Ant,pathToTake){
    if(allPath[pathToTake].length > 0){
        Ant.leader(allPath[pathToTake][allPath[pathToTake].length -1]);
        if(Ant.x == allPath[pathToTake][allPath[pathToTake].length -1].x 
            && Ant.y == allPath[pathToTake][allPath[pathToTake].length -1].y){
            removeAndSave(allPath[pathToTake], allPath[pathToTake][allPath[pathToTake].length -1], replayPath[pathToTake]);
        }
    }
    else{
        Ant.followN(end.x,end.y);

        if(Ant.x == end.x && Ant.y == end.y){
            console.log("Ant arrived");
            return true;
        }
        else{return false;}
    }
}


function followShortestPath(Ant){
    if(shortestPath.length > 0){
        Ant.followN(shortestPath[shortestPath.length - 1].x,shortestPath[shortestPath.length - 1].y);
        if(Ant.x == shortestPath[shortestPath.length - 1].x && Ant.y == shortestPath[shortestPath.length - 1].y){
            removePointFromList(shortestPath, shortestPath[shortestPath.length - 1]);
        }
    }
    else{
        Ant.followN(end.x,end.y);
    }
}

// TODO : found a file to place this function
function displayHideID(id){
    // const lst = ["tutorial", "information", "more"];
    // if(lst.includes(id)){
    //     // caché tous les autres
    //     lst.forEach(eltID =>{
    //         if(eltID != id){
    //             let elt = document.getElementById(eltID);
    //             elt.style.display = 'none';
    //         }
    //         }
    //     );
    // }

    console.log("displayHideID", id);
    let elt = document.getElementById(id);
    elt.style.display = (elt.style.display == 'block') ? 'none' : 'block';

}


function updatePointObstacle(){
    for(var i = 0; i < algoAetoile.allPoints.length; i++){
        for(var j = 0; j < algoAetoile.allPoints[i].length; j++){
            if(obstacleManager.obstacles.length > 0){
                for(var ob of obstacleManager.obstacles){
                    var dist = Math.sqrt(Math.pow(algoAetoile.allPoints[i][j].x - ob.centerX, 2) + Math.pow(algoAetoile.allPoints[i][j].y - ob.centerY, 2));
                    if(dist <= ob.radius){
                        algoAetoile.allPoints[i][j].isInObstacle = true;
                    }
                }
            }
        }
    }
}

function allFalse(){
    for(var i = 0; i < algoAetoile.allPoints.length; i++){
        for(var j = 0; j < algoAetoile.allPoints[i].length; j++){
            algoAetoile.allPoints[i][j].isInObstacle = false;
        }
    }
}

function resetallCost(){
    for(var i = 0; i < algoAetoile.allPoints.length; i++){
        for(var j = 0; j < algoAetoile.allPoints[i].length; j++){
            algoAetoile.allPoints[i][j].costFromStart = 0;
            algoAetoile.allPoints[i][j].costToTheEnd = 0;
            algoAetoile.allPoints[i][j].totalCost = 0;
        }
    }
}

function seekShortestPath(){
    if(animationFrame){
        cancelAnimationFrame(animationFrame);
    }



    if(unexploredPoint.length > 0){

        var pointToExplore = 0;
        for(var i = 0; i < unexploredPoint.length; i++){
            if(unexploredPoint[i].totalCost < unexploredPoint[pointToExplore].totalCost){
                pointToExplore = i;
            }
        }

        var currentPoint = unexploredPoint[pointToExplore];
        
        if(currentPoint == endPoint){
            console.log("Shortest path found");
            //console.log(shortestPath)
            pauseDraw();
            stop = true;
            
        }

        removePointFromList(unexploredPoint, currentPoint);
        exploredPoint.push(currentPoint);

        var voisins = currentPoint.neighbors;
        for(var i=0; i < voisins.length; i++){
            if(!exploredPoint.includes(voisins[i]) && !voisins[i].isInObstacle){
                var newCostFromStart = currentPoint.costFromStart + heuristic(currentPoint, voisins[i]);

                var newPath = false;
                if(unexploredPoint.includes(voisins[i])){
                    if(newCostFromStart < voisins[i].costFromStart){
                        voisins[i].costFromStart = newCostFromStart;
                        newPath = true;
                    }
                }
                else{
                    voisins[i].costFromStart = newCostFromStart;
                    newPath = true;
                    unexploredPoint.push(voisins[i]);
                }

                if(newPath){
                    voisins[i].costToTheEnd = heuristic(voisins[i], end);
                    voisins[i].totalCost = voisins[i].costFromStart + voisins[i].costToTheEnd;
                    voisins[i].parent = currentPoint;
                }
            }
        }
        
    }
    else{
        console.log('no solution');
        stop = true;
    }


    for(var i = 0; i < unexploredPoint.length; i++){
        //draw a rectangle
        d.canvas.getContext('2d').clearRect(unexploredPoint[i].x, unexploredPoint[i].y, 4, 4);
    }

    for(var i = 0; i < exploredPoint.length; i++){
        //draw a rectangle
        d.canvas.getContext('2d').clearRect(exploredPoint[i].x, exploredPoint[i].y, 4, 4);
    }
    

    shortestPath = [];
    var temp = currentPoint;
    console.log("searching wait"); 
    shortestPath.push(temp);
    while (temp.parent) {
      shortestPath.push(temp.parent);
      temp = temp.parent;
    }

    for(var i = 0; i < shortestPath.length; i++){
        //draw a rectangle
        d.canvas.getContext('2d').fillStyle = "white";
        d.canvas.getContext('2d').fillRect(shortestPath[i].x, shortestPath[i].y, 4, 4);
    }

    if(!stop){
        animationFrame = requestAnimationFrame(seekShortestPath);
    }

    if(algoAetoile.length > 0){
        for(var i = 0; i < algoAetoile.length; i++){
            algoAetoile[i].drawOnePath();
        }
    }






}

function removePointFromList(array, element){
    for(var i = array.length-1; i >= 0; i--){
        if(array[i] == element){
            array.splice(i,1);
        }
    } 
}

function removeAndSave(array, element, arrayToSave){
    for(var i = array.length-1; i >= 0; i--){
        if(array[i] == element){
            arrayToSave.unshift(element);
            array.splice(i,1);
        }
    }
}


function heuristic(a,b){
    var d = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    return d;
}
