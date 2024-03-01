var Antspeed = 10;
var BeforePheromone = 0.015;
var AfterPheromone = 0.05;
var Ant = /** @class */ (function () {
    //ant constructor
    function Ant(link, x, y, colony) {
        //image, speed, pos, distance
        this.img = document.createElement('img');
        this.speedX = 0;
        this.speedY = 0;
        this.colony = 0;
        this.backward = false;
        this.colony = colony;
        this.img.src = link;
        this.img.style.position = 'absolute';
        this.img.style.transform = 'translateX(' + -50 + '%) translateY(' + -50 + '%)';
        this.img.style.width = x + 'px';
        this.img.style.height = y + 'px';
    }
    //teleport the ant to x and y, update distance and coordonates
    Ant.prototype.move = function (x, y) {
        this.img.style.left = x + 'px';
        this.img.style.top = y + 'px';
        this.x = x;
        this.y = y;
    };
    Ant.prototype.isOnIsland = function () {
        return (Math.abs(this.targetIsland.x - this.x) < 10 && Math.abs(this.targetIsland.y - this.y) < 10);
    };
    Ant.prototype.followIsland = function (island) {
        var dx = island.x - this.x;
        var dy = island.y - this.y;
        if (Math.max(Math.abs(dx), Math.abs(dy)) >= Antspeed) {
            this.speedX = dx / Math.max(Math.abs(dx), Math.abs(dy)) * Antspeed;
            this.speedY = dy / Math.max(Math.abs(dx), Math.abs(dy)) * Antspeed;
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
    Ant.prototype.updatePosition = function () {
        if (this.isOnIsland()) {
            this.choseNewTarget();
        }
        this.followIsland(this.targetIsland);
    };
    Ant.prototype.choseNewTarget = function () {
        var currentIsland = this.targetIsland;
        var targetIsland;
        if (this.previousIsland != currentIsland) {
            for (var _i = 0, _a = Array.from(currentIsland.linkedIslands.keys()); _i < _a.length; _i++) {
                var key = _a[_i];
                if (this.previousIsland.linkedIslands.has(key)) {
                    if (this.backward == true) {
                        AllLines.get(key).pheromones[this.colony][currentIsland.linkedIslands.get(key)[1]] += AfterPheromone;
                    }
                    else {
                        AllLines.get(key).pheromones[this.colony][currentIsland.linkedIslands.get(key)[1]] += BeforePheromone;
                    }
                }
            }
        }
        if (currentIsland.linkedIslands.size == 1) {
            for (var _b = 0, _c = Array.from(currentIsland.linkedIslands.keys()); _b < _c.length; _b++) {
                var key = _c[_b];
                targetIsland = currentIsland.linkedIslands.get(key)[0];
                this.updatePheromone(key, currentIsland);
            }
        }
        else {
            var sum = 0;
            var tar = 0;
            var once = true;
            for (var _d = 0, _e = Array.from(currentIsland.linkedIslands.keys()); _d < _e.length; _d++) {
                var key = _e[_d];
                if (!this.targetIsland.linkedIslands.get(key)[0].isEqual(this.previousIsland) || (currentIsland instanceof IslandFood && this.backward == false) || (currentIsland instanceof IslandAnthill && this.backward == true)) {
                    sum += (AllLines.get(key).pheromones[this.colony][currentIsland.linkedIslands.get(key)[1]]);
                }
            }
            tar = sum * Math.random();
            sum = 0;
            for (var _f = 0, _g = Array.from(currentIsland.linkedIslands.keys()); _f < _g.length; _f++) {
                var key = _g[_f];
                if (!this.targetIsland.linkedIslands.get(key)[0].isEqual(this.previousIsland) || (currentIsland instanceof IslandFood && this.backward == false) || (currentIsland instanceof IslandAnthill && this.backward == true)) {
                    sum += (AllLines.get(key).pheromones[this.colony][currentIsland.linkedIslands.get(key)[1]]);
                    if (sum >= tar && once) {
                        var choosenkey = key;
                        targetIsland = currentIsland.linkedIslands.get(key)[0];
                        this.updatePheromone(choosenkey, currentIsland);
                        once = false;
                    }
                }
            }
        }
        this.previousIsland = currentIsland;
        this.targetIsland = targetIsland;
    };
    Ant.prototype.updatePheromone = function (choosenkey, currentIsland) {
        if ((currentIsland instanceof IslandAnthill) && this.backward == true) {
            this.backward = false;
            this.img.src = './assets/ant.png';
        }
        if (currentIsland instanceof IslandFood && this.backward == false) {
            this.backward = true;
            this.img.src = './assets/antFood.png';
        }
        if (this.backward == true) {
            AllLines.get(choosenkey).pheromones[this.colony][currentIsland.linkedIslands.get(choosenkey)[1]] += AfterPheromone;
        }
        else {
            AllLines.get(choosenkey).pheromones[this.colony][currentIsland.linkedIslands.get(choosenkey)[1]] += BeforePheromone;
        }
    };
    Ant.prototype.isAnt = function (ant) {
        return (ant.x == this.x && ant.y == this.y);
    };
    Ant.prototype.removeAnt = function () {
        Islands.forEach(function (island) {
            if (island instanceof IslandAnthill) {
                if (island.colonyNumber == this.colony) {
                    for (var i = 0; i < island.colonyAnts.length; i++) {
                        if (island.colonyAnts[i].isAnt(this)) {
                            island.colonyAnts.splice(i, 1);
                            document.body.removeChild(this.img);
                        }
                    }
                }
            }
        }.bind(this));
    };
    return Ant;
}());
