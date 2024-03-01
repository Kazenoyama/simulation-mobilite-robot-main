var Bridge = /** @class */ (function () {
    function Bridge(x0, y0, island0) {
        this.pheromones = new Array;
        this.island0 = island0;
        this.x0 = x0;
        this.y0 = y0;
        this.canvas = document.createElement('canvas');
        this.pheromones[0] = new Array();
        this.pheromones[0].push(0.01);
        this.pheromones[0].push(0.01);
        this.initCanvas();
    }
    // getpheromones(nb:number) : Array<number>{
    //     if(nb == 1) {
    //         return this.pheromones1;
    //     }
    //     if(nb == 2){
    //         return this.pheromones2;
    //     }
    //     return null;
    // }
    Bridge.prototype.getOther = function (nb) {
        if (nb == 0) {
            return this.island1;
        }
        return this.island0;
    };
    Bridge.prototype.getX = function (nb) {
        if (nb == 0) {
            return this.x0;
        }
        if (nb == 1) {
            return this.x1;
        }
        return null;
    };
    Bridge.prototype.getY = function (nb) {
        if (nb == 0) {
            return this.y0;
        }
        if (nb == 1) {
            return this.y1;
        }
        return null;
    };
    Bridge.prototype.initCanvas = function () {
        this.canvas.width = window.innerWidth * 0.8;
        this.canvas.height = window.innerHeight;
        this.canvas.style.width = "auto";
        this.canvas.style.height = "auto";
        this.canvas.style.margin = '0';
        this.canvas.style.position = 'absolute';
        var context = this.canvas.getContext("2d");
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = 'rgb(255,0,255)';
        context.lineWidth = 1;
        document.body.appendChild(this.canvas);
    };
    Bridge.prototype.updateCanvas = function () {
        var ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.beginPath();
        ctx.moveTo(this.x0, this.y0);
        ctx.lineTo(this.x1, this.y1);
        ctx.stroke();
    };
    Bridge.prototype.updateCanvasLinked = function () {
        var ctx = this.canvas.getContext('2d');
        ctx.lineWidth = Math.max(Math.min(10, (this.pheromones[0][0] + this.pheromones[0][1]) / 2), 1);
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.beginPath();
        ctx.moveTo(this.island0.x, this.island0.y);
        ctx.lineTo(this.island1.x, this.island1.y);
        ctx.stroke();
        ctx.font = '10px serif';
        ctx.fillText(this.pheromones[0][0] + ", " + Math.log(this.pheromones[0][0]), this.island0.x + (this.island1.x / 10), this.island0.y + (this.island1.y / 10));
        ctx.fillText(this.pheromones[0][1] + ", " + Math.log(this.pheromones[0][1]), this.island1.x + (this.island0.x / 10), this.island1.y + (this.island0.y / 10));
    };
    return Bridge;
}());
