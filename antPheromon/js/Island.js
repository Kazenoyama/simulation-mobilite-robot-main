var keyPath = 1;
var isPathDrawing = false;
var Islands = new Array();
var AllLines = new Map();
var Island = /** @class */ (function () {
    function Island() {
        this.img = document.createElement('img');
        this.drag = true;
        this.linkedIslands = new Map();
        this.img.src = './assets/Island.png';
        this.img.style.position = 'absolute';
        this.img.style.transform = 'translateX(' + -50 + '%) translateY(' + -50 + '%)';
        this.img.style.width = 100 + 'px';
        this.img.style.height = 100 + 'px';
        this.img.style.left = '90%';
        this.img.style.top = '20%';
        this.img.style.cursor = 'pointer';
        document.body.appendChild(this.img);
        window.drag = this.drag ? this : null;
        this.img.addEventListener('mousedown', function (event) {
            if (event.button == 2) {
                if (!isPathDrawing) {
                    var bridge = new Bridge(this.x, this.y, this);
                    AllLines.set(keyPath, bridge);
                    window.draw = this;
                    isPathDrawing = !isPathDrawing;
                }
                else if (!window.draw.isEqual(this)) {
                    var bridge = AllLines.get(keyPath);
                    bridge.island1 = this;
                    bridge.x0 = window.draw.x;
                    bridge.y0 = window.draw.y;
                    bridge.x1 = this.x;
                    bridge.y1 = this.y;
                    bridge.updateCanvas();
                    window.draw.linkedIslands.set(keyPath, new Array(this, 0));
                    this.linkedIslands.set(keyPath, new Array(window.draw, 1));
                    isPathDrawing = !isPathDrawing;
                    keyPath++;
                }
            }
            if (event.button == 0 && this.x < (window.innerWidth * 0.76) && this.y < (window.innerHeight * 0.95)) {
                this.drag = !this.drag;
                window.drag = this.drag ? this : null;
            }
        }.bind(this));
    }
    Island.prototype.moveTo = function (x, y) {
        this.x = x;
        this.y = y;
        this.img.style.left = x + 'px';
        this.img.style.top = y + 'px';
    };
    Island.prototype.isEqual = function (o) {
        return (this.x == o.x && this.y == o.y);
    };
    return Island;
}());
