var mouseX;
var mouseY;
window.onload = function () {
    window.addEventListener("contextmenu", function (e) { return e.preventDefault(); });
    document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX; // Gets Mouse X
        mouseY = e.clientY;
        if (window.drag != null) {
            window.drag.img.style.left = mouseX + 'px';
            window.drag.img.style.top = mouseY + 'px';
            window.drag.x = mouseX;
            window.drag.y = mouseY;
            var _loop_1 = function (key) {
                Islands.forEach(function (island) {
                    if (island.linkedIslands.has(key) && !(island.isEqual(window.drag))) {
                        AllLines.get(key).updateCanvasLinked();
                    }
                });
            };
            for (var _i = 0, _a = Array.from(window.drag.linkedIslands.keys()); _i < _a.length; _i++) {
                var key = _a[_i];
                _loop_1(key);
            }
        }
        if (isPathDrawing) {
            AllLines.get(keyPath).x1 = mouseX;
            AllLines.get(keyPath).y1 = mouseY;
            AllLines.get(keyPath).updateCanvas();
        }
    });
    document.addEventListener('keydown', function (event) {
        if (event.code == 'Backspace' && window.drag != null) {
            window.drag.draw = false;
            document.body.removeChild(window.drag.img);
            var _loop_2 = function (key) {
                Islands.forEach(function (island) {
                    if (island.linkedIslands.has(key) && !(island.isEqual(window.drag))) {
                        document.body.removeChild(AllLines.get(key).canvas);
                        island.linkedIslands["delete"](key);
                        AllLines["delete"](key);
                    }
                });
            };
            for (var _i = 0, _a = Array.from(window.drag.linkedIslands.keys()); _i < _a.length; _i++) {
                var key = _a[_i];
                _loop_2(key);
            }
            for (var i = 0; i < Islands.length; i++) {
                if (Islands[i].isEqual(window.drag)) {
                    Islands.splice(i, 1);
                }
            }
            window.drag = null;
        }
    });
    document.getElementById('selectIsland').addEventListener('click', function (event) {
        Islands.push(new Island());
        Islands[Islands.length - 1].moveTo(event.clientX, event.clientY);
    });
    document.getElementById('selectAnthill').addEventListener('click', function (event) {
        Islands.push(new IslandAnthill());
        Islands[Islands.length - 1].moveTo(event.clientX, event.clientY);
    });
    document.getElementById('selectFood').addEventListener('click', function (event) {
        Islands.push(new IslandFood());
        Islands[Islands.length - 1].moveTo(event.clientX, event.clientY);
    });
};
function main() {
    for (var _i = 0, _a = Array.from(AllLines.keys()); _i < _a.length; _i++) {
        var key = _a[_i];
        AllLines.get(key).updateCanvasLinked();
    }
    spawnAnts();
    moveAnts();
    reducePheromones();
    setTimeout(main, 10);
}
function spawnAnts() {
    Islands.forEach(function (island) {
        if (island instanceof IslandAnthill) {
            island.spawnAnts();
        }
    });
}
function moveAnts() {
    Islands.forEach(function (island) {
        if (island instanceof IslandAnthill) {
            for (var _i = 0, _a = island.colonyAnts; _i < _a.length; _i++) {
                var ant = _a[_i];
                ant.updatePosition();
            }
        }
    });
}
function reducePheromones() {
    // let i:number=0;
    // Islands.forEach(function(island) {
    //     if(island instanceof IslandAnthill) {
    //         for(let ant of island.colonyAnts){
    //             i++;
    //         }
    //     }
    // });  
    for (var _i = 0, _a = Array.from(AllLines.keys()); _i < _a.length; _i++) {
        var key = _a[_i];
        for (var i = 0; i < AllLines.get(key).pheromones.length; i++) {
            AllLines.get(key).pheromones[i][0] = Math.max(0.01, (AllLines.get(key).pheromones[i][0] - Antspeed * 0.001));
            AllLines.get(key).pheromones[i][1] = Math.max(0.01, (AllLines.get(key).pheromones[i][1] - Antspeed * 0.001));
        }
    }
}
