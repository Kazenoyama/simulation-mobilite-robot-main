window.addEventListener("keydown", function (event) {
    // console.log(event);

    switch (event.key) {

      case " ":
        console.log("space");
        pauseDraw();
        // Faire quelque chose pour la touche "esc" pressée.
        break;
      case "u":
        console.log("ajout obstacle");
        var obs = d.getObstaclesManager();
        obs.addObstacle(d.canvas,d.context);
        obs.draw(d.context);
        break;
      case "i":
        console.log("supression obstacle");
        var obs = d.getObstaclesManager();
        obs.removeLastObstacle();
        d.clearCanvas();
        break;
      case"r":
        location.reload();
        break;

      case "f":
        console.log("start A etoile algorithm")
        fireAetoile = true;
        break;

      case "w":
        console.log("Juste le A etoile");
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
        allFalse();
        updatePointObstacle();
        seekShortestPath();
        break;
      case "s":
        if(!newMethod){newMethod = true;}
        else{newMethod = false;}
        console.log("new method : " + newMethod);
        break;

      case "p":
        if(canReplay){
          console.log("Replay of the ants");
          allPath = [];
          for(var i=0; i< replayPath.length; i++){
            allPath.push(replayPath[i]);
            replayPath[i] = [];
          }
          console.log(allPath);
          console.log(replayPath);
          canReplay = false;
          startAntsMethodeDeux();
          break;
      }
        

      default:
        return; // Quitter lorsque cela ne gère pas l'événement touche.
    }
  
  }, true);