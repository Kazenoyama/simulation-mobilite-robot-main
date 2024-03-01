var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var DrawingAnt = /** @class */ (function (_super) {
    __extends(DrawingAnt, _super);
    function DrawingAnt(link, x, y, draw) {
        var _this = _super.call(this, link, x, y) || this;

        // Besoin du contexte du canvas dans la  fonction move je sais pas pourquoi
        _this.canvas = document.createElement('canvas');
        // A QUOI SERT CETTE LIGNE ??
        _this.draw = false;


        if (draw &&
            chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1] / chart.data.datasets[0].data[chart.data.datasets[0].data.length - 2] != 1) {

            _this.canvas.width = document.getElementById("playGround").offsetWidth;
            _this.canvas.height = document.getElementById("playGround").offsetHeight;

            var context = _this.canvas.getContext("2d");
            context.lineCap = 'round';
            context.lineJoin = 'round';
            context.strokeStyle = 'rgb(' + pathColorRedValue + ',' + pathColorGreenValue + ',' + pathColorBlueValue + ')';
            context.lineWidth = 1;

            document.getElementById("playPanel").appendChild(_this.canvas);

            canvasTab.push(_this.canvas);

            var pathSelect = document.getElementById('pathDrawing');
            pathSelect.max = parseInt(pathSelect.max) + 1;
        }

        return _this;
    }
    DrawingAnt.prototype.move = function (x, y) {
        var ctx = this.canvas.getContext('2d');
        this.img.style.left = x + 'px';
        this.img.style.top = y + 'px';
        this.x = x;
        this.y = y;
        this.distance += Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
    };
    return DrawingAnt;
}(Ant));
