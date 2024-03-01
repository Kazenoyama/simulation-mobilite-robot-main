class Setup{
    constructor(w,h,start,end,ctx){
        this.w = w;
        this.h = h;
        this.ctx = ctx;
        this.allPoints = [];
        this.stopIntervale = false; //<== This is the variable that will stop the intervalle
        this.color;

        //Before seekPath
        this.numberOfIntermediaryPoints = 2;
        this.intermediaryPoints = [];
        this.stop = false;
        this.start = start;
        this.end = end;
        this.startSet = [];
        this.endSet = [];
        this.intermediaryPoints = [];

        //During seekPath
        this.unexplored = [];
        this.explored = [];
        this.path = [];

        //After seekPath
        this.allPath = [];
        this.onePath = [];
        this.obstacles = [];

        this.drawFinished = false;

        
        
    }

    getRandomColor() {
        // Generate random values for red, green, and blue
        var red = Math.floor(Math.random() * 256);
        var green = Math.floor(Math.random() * 256);
        var blue = Math.floor(Math.random() * 256);
      
        // Create the RGB color string
        var color = 'rgb(' + red + ',' + green + ',' + blue + ')';
      
        this.color = color;
      }

    listePoint(){
        var temporaryCol = [];
        for(var i = 0; i < this.w; i+= 10){

            temporaryCol = [];
            for(var j = 0; j < this.h; j+=10){
                temporaryCol.push(new UnPoint(i,j));
            }

            this.allPoints.push(temporaryCol);
        }

        this.setVoisins();
        this.colonne = this.allPoints.length;
        this.row = this.allPoints[0].length;
        console.log(this.colonne)
        console.log(this.row)
    }

    setVoisins(){
        for(var i = 0; i < this.allPoints.length; i++){
            for(var j =0; j < this.allPoints[i].length; j++){
                if(i > 0){
                    this.allPoints[i][j].neighbors.push(this.allPoints[i-1][j]); //left
                }
                if(i < this.allPoints.length-1){
                    this.allPoints[i][j].neighbors.push(this.allPoints[i+1][j]); //right
                }
                if(j > 0){
                    this.allPoints[i][j].neighbors.push(this.allPoints[i][j-1]); //top
                }
                if(j < this.allPoints[i].length-1){
                    this.allPoints[i][j].neighbors.push(this.allPoints[i][j+1]); //bottom
                }

                //diagonals
                if(i > 0 && j > 0){
                    this.allPoints[i][j].neighbors.push(this.allPoints[i-1][j-1]); //top left
                }
                if(i < this.allPoints.length-1 && j > 0){
                    this.allPoints[i][j].neighbors.push(this.allPoints[i+1][j-1]); //top right
                }
                if(i > 0 && j < this.allPoints[i].length-1){
                    this.allPoints[i][j].neighbors.push(this.allPoints[i-1][j+1]); //bottom left
                }
                if(i < this.allPoints.length-1 && j < this.allPoints[i].length-1){
                    this.allPoints[i][j].neighbors.push(this.allPoints[i+1][j+1]); //bottom right
                }
            }
        }
    }

    updateObstacle(obstacle){
        var number =0;
        for(var i = 0; i < this.allPoints.length; i++){
            for(var j=0; j < this.allPoints[i].length; j++){
                for(var k = 0; k < this.obstacles.length; k++){
                    if(this.distance(this.allPoints[i][j], this.obstacles[k])){
                        this.allPoints[i][j].isInObstacle = true;
                        number++;
                    }
                    
                }
            }
        }
    }

    reset(){
        for(var i=0; i<this.allPoints.length; i++){
            for(var j=0; j<this.allPoints[i].length; j++){
                this.allPoints[i][j].parent = undefined;
                this.allPoints[i][j].costFromStart = 0;
                this.allPoints[i][j].costToTheEnd = 0;
                this.allPoints[i][j].totalCost = 0;
            }
        }
    }

    resetSet(){
        this.explored = [];
        this.unexplored = [];
        this.path = [];
    }

    removePointFromList(array, element){
        for(var i = array.length-1; i >= 0; i--){
            if(array[i] == element){
                array.splice(i,1);
            }
        } 
    }

    distance(point, ob){
        if(Math.sqrt(Math.pow(point.x - ob.centerX,2) + Math.pow(point.y - ob.centerY,2)) <= ob.radius){
            return true;
        }
    }

    heuristic(a,b){
        var d = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
        return d;
    }

    setupAndGenerate(obstacle){
        this.obstacles = obstacle;
        this.listePoint();
        this.updateObstacle(obstacle);
        this.getRandomColor();
        for(var i = 0; i < this.allPoints.length; i++){
            for(var j =0; j < this.allPoints[i].length; j++){
                if(this.allPoints[i][j] === this.start || (this.allPoints[i][j].x == this.start.x && this.allPoints[i][j].y == this.start.y)){
                    //console.log("Found the start")
                    this.start = this.allPoints[i][j];
                }

                if(this.allPoints[i][j] === this.end || (this.allPoints[i][j].x == this.end.x && this.allPoints[i][j].y == this.end.y)){
                    //console.log("Found the end")
                    this.end = this.allPoints[i][j];
                }
            }
        }

        this.startSet.push(this.start);

        for(var i = 0; i < this.numberOfIntermediaryPoints; i++){
            var inter = this.allPoints[Math.floor(Math.random()*this.colonne)][Math.floor(Math.random()*this.row)];
            while(inter.isInObstacle){
                inter = this.allPoints[Math.floor(Math.random()*this.colonne)][Math.floor(Math.random()*this.row)];
            }
            inter.draw(this.ctx, this.color)
            this.intermediaryPoints.push(inter);
        }

        for(var i = 0; i < this.intermediaryPoints.length; i++){
            this.startSet.push(this.intermediaryPoints[i]);
            this.endSet.push(this.intermediaryPoints[i]);
        }
        this.endSet.push(this.end);
        this.end = this.endSet[0];

        this.unexplored.push(this.startSet[0]);
        //console.log(this.startSet);
        //console.log(this.endSet);
    }

    run(){
        var interval = setInterval(() => {
            if(!this.stopIntervale){
                this.seekPath();
            } 
            else{
                clearInterval(interval);
                console.log("I stop the intervalle")
            }  
        }, 1);
    }

    seekPath(){
        if(!this.stop){
            if(this.unexplored.length > 0){
                console.log("Seeking path")
                //console.log(this.start, this.end)
                
                var pointToExplore = 0;
                for(var i = 0; i < this.unexplored.length; i++){
                    if(this.unexplored[i].totalCost < this.unexplored[pointToExplore].totalCost){
                        pointToExplore = i;
                    }
                }

                var currentPoint = this.unexplored[pointToExplore];
                //Finish conditions
                if(currentPoint == this.end ||(currentPoint.x == this.end.x && currentPoint.y == this.end.y)){
                    this.stop = true;
                }

                this.removePointFromList(this.unexplored, currentPoint);
                this.explored.push(currentPoint);

                var voisins = currentPoint.neighbors;
                for(var i=0; i<voisins.length ; i++ ){
                    if(!this.explored.includes(voisins[i]) && !voisins[i].isInObstacle){
                        var newCostFromStart = currentPoint.costFromStart + this.heuristic(voisins[i],currentPoint);

                        var newPath = false;
                        if(this.unexplored.includes(voisins[i])){
                            if(newCostFromStart < voisins[i].costFromStart){
                                voisins[i].costFromStart = newCostFromStart;
                                newPath = true;
                            }
                        }

                        else{
                            voisins[i].costFromStart = newCostFromStart;
                            newPath = true;
                            this.unexplored.push(voisins[i]);
                        }

                        if(newPath){
                            voisins[i].costToTheEnd = this.heuristic(voisins[i], this.end);
                            voisins[i].totalCost = voisins[i].costFromStart + voisins[i].costToTheEnd;
                            voisins[i].parent = currentPoint;
                        }
                    }
                }
            }

            else{
                console.log("No solution");
                this.stop = true;
            }

            this.path = [];
            var temp = currentPoint;
            this.path.push(temp);
            while(temp.parent){
                this.path.push(temp.parent);
                temp = temp.parent;
            }

            for(var i =0; i < this.explored.length; i++){
                this.ctx.clearRect(this.explored[i].x, this.explored[i].y, 4, 4);
            
            }

            for(var i =0; i < this.unexplored.length; i++){
                this.ctx.clearRect(this.unexplored[i].x, this.unexplored[i].y, 4, 4);
            }

            for (var i = 0; i < this.path.length; i++) {
                this.path[i].draw(this.ctx, this.color);
            }

            if(!this.stop){/*Do nothing*/ }
            else{
                this.allPath.push(this.path);
                this.reset();

                if(this.startSet.length > 1){
                    //console.log("Je passe ici pour refaire un tour")
                    this.stop = false;
                    this.resetSet();

                    this.startSet.shift();
                    this.endSet.shift();

                    this.unexplored.push(this.startSet[0]);
                    this.end = this.endSet[0];
                }

                else{
                    this.stop = true;
                }
            }
        }

        else{
            console.log("L'algo est terminer")

            for(var i =this.allPath.length-1; i >=0 ; i--){
                for(var j = 0; j < this.allPath[i].length; j++){
                    if(this.allPath[i][j] != this.start && this.allPath[i][j] != this.end){
                    this.onePath.push(this.allPath[i][j]);}
                }
            }
            /*
            for(var i =0; i < this.allPath.length; i++){
                for(var j = 0; j < this.allPath[i].length; j++){
                    if(this.allPath[i][j] != this.start && this.allPath[i][j] != this.end){
                    this.onePath.push(this.allPath[i][j]);}
                }
            }*/

            this.stopIntervale = true;
        }
    }

    draw(ctx){
        for(var i = 0; i < this.allPoints.length; i++){
            for(var j =0; j < this.allPoints[i].length; j++){
                ctx.fillStyle = "red";
                ctx.fill();
                ctx.fillRect(this.allPoints[i][j].x, this.allPoints[i][j].y, 50, 50);
            }
            
        }

    }

    drawOnePath(){
        for(var i = 0; i < this.onePath.length; i++){
            this.onePath[i].draw(this.ctx, this.color);
        }
    }
    
}