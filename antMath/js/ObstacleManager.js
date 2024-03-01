class ObstacleManager{
    constructor(w,h){
        this.obstacles = [];
        this.w = w;
        this.h = h;
    }

    addObstacle(canvas,context){
        var size = document.getElementById("obstacleSize");
        var randoSize = document.getElementById("obstacleRandomSize");
        var randoPos = document.getElementById("obstacleRandomPos");
        console.log(randoSize.value);
        var taille;
        var pos = {x:0,y:0};
        if(randoPos.value == 1){
            if(randoSize.value == 1){taille = Math.floor(Math.random() * (250 - 25 + 1) + 25);}
            else{taille = size.value}
            pos = {x:Math.random()* this.w,y: Math.random()* this.h};
        }

        else{
            if(randoSize.value == 1){taille = Math.floor(Math.random() * (250 - 25 + 1) + 25);}
            else{taille = size.value}
            pos = {x:this.w / 2,y: this.h / 2};

        }


        this.obstacles.push(new Obstacle(pos.x, pos.y,taille));
        
        this.obstacles[this.obstacles.length-1].getRandomColor();
        this.obstacles[this.obstacles.length-1].attachClickListener(canvas);
        this.obstacles[this.obstacles.length-1].attachDragListener(canvas,context);
        //document.getElementById("obstacleContainer").appendChild(this.obstacles[this.obstacles.length-1].img);
        

    }

    removeLastObstacle(){
        this.obstacles.pop();
    }

    draw(context){
        for(let i = 0; i < this.obstacles.length; i++){
            this.obstacles[i].draw(context);
        }
    }
}