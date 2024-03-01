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
        _this.canvas = document.createElement('canvas');
        _this.draw = false;
        _this.canvas.width = window.innerWidth * 0.75;
        _this.canvas.height = window.innerHeight * 0.9;
        _this.canvas.style.width = "auto";
        _this.canvas.style.height = "auto";
        _this.canvas.style.margin = '0';
        _this.canvas.style.position = 'absolute';
        if (!draw) {
            _this.canvas.style.opacity = '0';
        }
        var context = _this.canvas.getContext("2d");
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = 'rgb(' + 255 + ',0,' + 255 + ')';
        context.lineWidth = 1;
        document.getElementById("playPanel").appendChild(_this.canvas);
        return _this;
    }
    DrawingAnt.prototype.move = function (x, y) {
        var ctx = this.canvas.getContext('2d');
        this.img.style.left = x + 'px';
        this.img.style.top = y + 'px';
        this.x = x;
        this.y = y;
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
    };
    return DrawingAnt;
}(Ant));
