class UnPoint{

    constructor(x,y){
        this.x = x;
        this.y = y;


        this.neighbors = [];
        this.parent = undefined;

        this.costToTheEnd = 0;
        this.totalCost = 0;
        this.costFromStart = 0;



        this.isInObstacle = false;
    }

    draw(ctx,color){
        ctx.fillStyle = color;
        ctx.fill();
        ctx.fillRect(this.x, this.y, 4, 4);
    }
}   