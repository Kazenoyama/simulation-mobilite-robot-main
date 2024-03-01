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
var IslandAnthill = /** @class */ (function (_super) {
    __extends(IslandAnthill, _super);
    function IslandAnthill() {
        var _this = _super.call(this) || this;
        _this.colonyNumber = 0;
        _this.colonyAnts = new Array();
        _this.img.src = "./assets/IslandAnthill.png";
        _this.img.style.top = '40%';
        return _this;
    }
    IslandAnthill.prototype.spawnAnts = function () {
        if (this.colonyAnts.length > 0) {
            if (Math.sqrt((this.colonyAnts[this.colonyAnts.length - 1].x - this.x) * (this.colonyAnts[this.colonyAnts.length - 1].x - this.x) + (this.colonyAnts[this.colonyAnts.length - 1].y - this.y) * (this.colonyAnts[this.colonyAnts.length - 1].y - this.y)) > 1 && this.colonyAnts.length < (Islands.length * 100)) {
                this.colonyAnts.push(new Ant('./assets/ant.png', 30, 30, this.colonyNumber));
                this.colonyAnts[this.colonyAnts.length - 1].move(this.x, this.y);
                this.colonyAnts[this.colonyAnts.length - 1].previousIsland = this;
                this.colonyAnts[this.colonyAnts.length - 1].targetIsland = this;
                document.body.appendChild(this.colonyAnts[this.colonyAnts.length - 1].img);
            }
        }
        else {
            this.colonyAnts.push(new Ant('./assets/ant.png', 30, 30, this.colonyNumber));
            this.colonyAnts[this.colonyAnts.length - 1].move(this.x, this.y);
            this.colonyAnts[this.colonyAnts.length - 1].previousIsland = this;
            this.colonyAnts[this.colonyAnts.length - 1].targetIsland = this;
            document.body.appendChild(this.colonyAnts[this.colonyAnts.length - 1].img);
        }
    };
    return IslandAnthill;
}(Island));
