var Ant = /** @class */ (function () {
    //ant constructor
    function Ant(link, x, y) {
        //image, speed, pos, distance
        this.img = document.createElement('img');
        this.speedX = 0;
        this.speedY = 0;
        this.distance = 0;
        this.img.src = link;
        this.img.style.position = 'absolute';
        this.img.style.transform = 'translateX(' + -50 + '%) translateY(' + -50 + '%)';
        this.img.style.width = x + 'px';
        this.img.style.height = y + 'px';

        this.done = false;
    }

    //teleport the ant to x and y, update distance and coordonates
    Ant.prototype.move = function (x, y) {
        this.img.style.left = x + 'px';
        this.img.style.top = y + 'px';
        this.x = x;
        this.y = y;
        this.distance += Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
    };

    //follow the given ant at with spacingAnt as distance
    Ant.prototype.follow = function (Ant,obManager,end) {
        
        var dx = Ant.x - this.x;
        var dy = Ant.y - this.y;
        if (Math.abs(dx) < spacingAnt && Math.abs(dy) < spacingAnt) {
            this.speedX = 0;
            this.speedY = 0;
        }
        else if (Math.max(Math.abs(dx), Math.abs(dy)) >= speedAnt) {
            this.speedX = dx / Math.max(Math.abs(dx), Math.abs(dy)) * speedAnt;
            this.speedY = dy / Math.max(Math.abs(dx), Math.abs(dy)) * speedAnt;
        }
        else {
            this.speedX = dx;
            this.speedY = dy;
        }
        var angl = Math.atan(dy / dx) * 180 / Math.PI;

        //colision ant/obstacle
        var pos = {
            x:this.getPositionWithoutPx(this.img.style.left),
            y:this.getPositionWithoutPx(this.img.style.top)
        };
        for(ob in obManager.obstacles){
            var dist = Math.sqrt(Math.pow(pos.x - obManager.obstacles[ob].centerX, 2) + Math.pow(pos.y - obManager.obstacles[ob].centerY, 2));
            if(dist < obManager.obstacles[ob].radius){
                this.goOverObstacle(Ant, obManager.obstacles[ob],end);
            }
        }
        ///////////////////////////

        if (dx < 0) {
            this.img.style.transform = 'translateX(' + -50 + '%) translateY(' + -50 + '%) rotate(' + (-90 + angl) + 'deg) ';
        }
        else {
            this.img.style.transform = 'translateX(' + -50 + '%) translateY(' + -50 + '%) rotate(' + ((-90 - angl) * (-1)) + 'deg) ';
        }
        this.move(this.x + this.speedX, this.y + this.speedY);
    };

    //follow the path by giving points one by one
    Ant.prototype.followN = function (x, y) {
        var dx = x - this.x;
        var dy = y - this.y;
        if (Math.max(Math.abs(dx), Math.abs(dy)) >= speedAnt) {
            this.speedX = dx / Math.max(Math.abs(dx), Math.abs(dy)) * speedAnt;
            this.speedY = dy / Math.max(Math.abs(dx), Math.abs(dy)) * speedAnt;
        }
        else {
            this.speedX = dx;
            this.speedY = dy;
        }
        var angl = Math.atan(dy / dx) * 180 / Math.PI;
        if (dx < 0) {
            this.img.style.transform = 'translateX(' + -50 + '%) translateY(' + -50 + '%) rotate(' + (-90 + angl) + 'deg) ';
        }
        else {
            this.img.style.transform = 'translateX(' + -50 + '%) translateY(' + -50 + '%) rotate(' + ((-90 - angl) * (-1)) + 'deg) ';
        }
        this.move(this.x + this.speedX, this.y + this.speedY);
    };

    

    //follow the end of the path (for the first ant only)
    Ant.prototype.followEnd = function (Ant,obManager,end) {
        var dx = Ant.x - this.x;
        var dy = Ant.y - this.y;
        if (Math.max(Math.abs(dx), Math.abs(dy)) >= speedAnt) {
            this.speedX = dx / Math.max(Math.abs(dx), Math.abs(dy)) * speedAnt;
            this.speedY = dy / Math.max(Math.abs(dx), Math.abs(dy)) * speedAnt;
        }
        else {
            this.speedX = dx;
            this.speedY = dy;
        }
        var angl = Math.atan(dy / dx) * 180 / Math.PI;

        //colision ant/obstacle
        var pos = {
            x:this.getPositionWithoutPx(this.img.style.left),
            y:this.getPositionWithoutPx(this.img.style.top)
        };
        for(ob in obManager.obstacles){
            var dist = Math.sqrt(Math.pow(pos.x - obManager.obstacles[ob].centerX, 2) + Math.pow(pos.y - obManager.obstacles[ob].centerY, 2));
            if(dist < obManager.obstacles[ob].radius){
                this.goOverObstacle(Ant, obManager.obstacles[ob],end);
            }
        }
        ///////////////////////////
        
        if (dx < 0) {
            this.img.style.transform = 'translateX(' + -50 + '%) translateY(' + -50 + '%) rotate(' + (-90 + angl) + 'deg) ';
        }
        else {
            this.img.style.transform = 'translateX(' + -50 + '%) translateY(' + -50 + '%) rotate(' + ((-90 - angl) * (-1)) + 'deg) ';
        }
        if (dx < 5 && dx > -5 && dy < 5 && dy > -5) {
            this.move(Ant.x, Ant.y);
        }
        else {
            this.move(this.x + this.speedX, this.y + this.speedY);
        }
    };


    //follow a new path in hope it is shorter than the previous one
    Ant.prototype.leader = function(path){
        var dx = path.x - this.x;
        var dy = path.y - this.y;
        
        if (Math.max(Math.abs(dx), Math.abs(dy)) >= speedAnt) {
            this.speedX = dx / Math.max(Math.abs(dx), Math.abs(dy)) * speedAnt;
            this.speedY = dy / Math.max(Math.abs(dx), Math.abs(dy)) * speedAnt;
        }
        else {
            this.speedX = dx;
            this.speedY = dy;
        }
        var angl = Math.atan(dy / dx) * 180 / Math.PI;
        if (dx < 0) {
            this.img.style.transform = 'translateX(' + -50 + '%) translateY(' + -50 + '%) rotate(' + (-90 + angl) + 'deg) ';
        }
        else {
            this.img.style.transform = 'translateX(' + -50 + '%) translateY(' + -50 + '%) rotate(' + ((-90 - angl) * (-1)) + 'deg) ';
        }
        this.move(this.x + this.speedX, this.y + this.speedY);
    }

    


    ////////////////////////////////////////////////////////////////////////////////////////////

    Ant.prototype.getPositionWithoutPx = function (pxCoord) {return parseInt(pxCoord,10);};

    Ant.prototype.getDistanceBetweenPoints= function(latitude1, longitude1, latitude2, longitude2) {
        let theta = longitude1 - longitude2;
        let distance = 60 * 1.1515 * (180/Math.PI) * Math.acos(
            Math.sin(latitude1 * (Math.PI/180)) * Math.sin(latitude2 * (Math.PI/180)) + 
            Math.cos(latitude1 * (Math.PI/180)) * Math.cos(latitude2 * (Math.PI/180)) * Math.cos(theta * (Math.PI/180))
        );
        return distance;}

    Ant.prototype.goOverObstacle = function(Ant, objet,end){
        console.log("Going over an obstacle");
        var speed = {x:0,y:0};
        var sp = 0.5;

        var centerX = objet.centerX;
        var centerY = objet.centerY;
        var radius = objet.radius;
        

        //Get the distance between 4 different point of the obstacle and the end
        
        var toEnd = {
            up:this.getDistanceBetweenPoints(centerX,centerY-radius,end.x,end.y),
            down:this.getDistanceBetweenPoints(centerX,centerY+radius,end.x,end.y),
            left:this.getDistanceBetweenPoints(centerX - radius,centerY,end.x,end.y),
            right:this.getDistanceBetweenPoints(centerX+radius,centerY,end.x,end.y)
        }

        var toAnt = {
            up:this.getDistanceBetweenPoints(centerX,centerY-radius,this.x,this.y),
            down:this.getDistanceBetweenPoints(centerX,centerY+radius,this.x,this.y),
            left:this.getDistanceBetweenPoints(centerX-radius,centerY,this.x,this.y),
            right:this.getDistanceBetweenPoints(centerX+radius,centerY,this.x,this.y)
        }

        //for each quadron of the circle, we create a path to the end 
        //Top left of the circle
        if(this.x < centerX && this.y < centerY){
            console.log("Top left");

            //End of the path right up corner
            if(end.x > centerX && end.y < centerY){
                console.log("End right up corner");
                speed = {x:-sp,y:-sp};}
            //End of the path left down corner
            else if(end.x < centerX && end.y > centerY){
                console.log("End left down corner");
                speed = {x:-sp,y:-sp};}

            //Special end    
            else if(toAnt.up <= toAnt.left && toEnd.right <= toEnd.down ){
                console.log("The ant is closer to the top and the end is closer to the right"); 
                speed = {x:-sp,y:-sp};}

            else if(toAnt.left < toAnt.up && toEnd.down < toEnd.right){
                console.log("The ant is closer to the left and the end is closer to the bottom");
                speed = {x:-sp,y:sp};}

            /*
            else if(end.x < centerX && end.y < centerY){
                console.log("End left up corner");
                speed = {x:-sp,y:-sp};}*/

            else{
                console.log("else")
                speed = {x:-sp,y:-sp};
            }

        }
        

        //Top right of the circle
        else if(this.x >= centerX && this.y < centerY){
            console.log("Top right");

            //End of the path right down corner
            if(end.x > centerX && end.y > centerY){
                console.log("End right down corner");
                speed = {x:sp,y:-sp};}

            //End of the path left up corner    
            else if(end.x < centerX && end.y < centerY){
                console.log("End left up corner");
                speed = {x:sp,y:-sp};}

            
            else if(toAnt.right <= toAnt.up && toEnd.down <= toEnd.left ){
                console.log("The ant is closer to the right and the end is closer to the bottom");
                speed = {x:sp,y:sp};}

            else if(toAnt.up <= toAnt.right && toEnd.left <= toEnd.down){
                console.log("The ant is closer to the top and the end is closer to the left");
                speed = {x:-sp,y:-sp};}

            else{
                console.log("else")
                speed = {x:sp,y:-sp};
            }

        }

        //Bottom right of the circle
        else if(this.x > centerX && this.y > centerY){
            console.log("Bottom right");

            //End of the path left down corner
            if(end.x <= centerX && end.y >= centerY){
                console.log("End left down corner");
                speed = {x:sp,y:sp};}

            //End of the path right up corner
            else if(end.x > centerX && end.y < centerY){
                console.log("End right up corner");
                speed = {x:sp,y:sp};}

            else if(toAnt.down < toAnt.right && toEnd.left < toEnd.up ){
                console.log("The ant is closer to the bottom and the end is closer to the left");
                speed = {x:sp,y:sp};}

            else if(toAnt.right < toAnt.down && toEnd.up < toEnd.left){
                console.log("The ant is closer to the right and the end is closer to the top");
                speed = {x:sp,y:sp};}
        
            else{
                console.log("else")
                speed = {x:sp,y:sp};
            }

        }

        //Bottom left of the circle
        else if(this.x < centerX && this.y > centerY){
            console.log("Bottom left");

            //End of the path left up corner
            if(end.x < centerX && end.y < centerY){
                console.log("End left up corner");
                speed = {x:-sp,y:sp};}
            
            //End of the path right down corner
            else if(end.x > centerX && end.y > centerY){
                console.log("End right down corner");
                speed = {x:-sp,y:sp};}

            else if(toAnt.left <= toAnt.down && toEnd.up <= toEnd.right ){
                console.log("The ant is closer to the left and the end is closer to the top");
                speed = {x:-sp,y:sp};}

            else if(toAnt.down < toAnt.left && toEnd.right < toEnd.up){
                console.log("The ant is closer to the bottom and the end is closer to the right");
                speed = {x:sp,y:sp};}

            else{
                console.log("else")
                speed = {x:-sp,y:sp};
            }
        }
        

        console.log("Speed : " + speed.x + " " + speed.y)
        if(this.speedX == 0 && this.speedY == 0){
            this.speedX = sp;
            this.speedY = sp;
        }
        this.speedX = speed.x;
        this.speedY = speed.y;
    };




    return Ant;
}());
