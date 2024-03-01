var DrawingApp = /** @class */ (function () {
    //parameters of the main canvas
    function DrawingApp() {
        var _this = this;
        this.clickX = new Array();
        this.clickY = new Array();
        this.clickDrag = [];
        this.canIDraw = true;

        this.addObs = document.getElementById("addObstacle");
        this.removeObs = document.getElementById("removeObstacle");
        
        this.clearEventHandler = function () {
            _this.clearCanvas();
        };
        this.releaseEventHandler = function () {
            console.log("releaseEventHandler");
            console.log(this.canIDraw);
            _this.paint = false;
            _this.redraw();
        };
        this.cancelEventHandler = function () {
            _this.paint = false;
        };
        //when pressed
        this.pressEventHandler = function (e) {
            this.canIDraw = true;
            console.log("pressEventHandler");
            if (draw) {
                var mouseX = e.changedTouches ?
                    e.changedTouches[0].pageX :
                    e.pageX;
                var mouseY = e.changedTouches ?
                    e.changedTouches[0].pageY :
                    e.pageY;
                mouseX -= _this.canvas.offsetLeft;
                mouseY -= _this.canvas.offsetTop;

                //Colision souris/obstacle
                for(this.ob of _this.obManager.obstacles){
                    var dist = Math.sqrt(Math.pow(mouseX - this.ob.getX(), 2) + Math.pow(mouseY - this.ob.getY(), 2));
                    if(dist <= this.ob.radius){
                        console.log("not drawing")
                        this.canIDraw = false;
                    }
                }

                ///////////////////////////

                if(this.canIDraw){
                _this.paint = true;
                _this.addClick(mouseX, mouseY, false);
                _this.redraw();}
            }
        };
        //when dragged
        this.dragEventHandler = function (e) {
            console.log("dragEventHandler");
            if (draw) {
                var mouseX = e.changedTouches ?
                    e.changedTouches[0].pageX :
                    e.pageX;
                var mouseY = e.changedTouches ?
                    e.changedTouches[0].pageY :
                    e.pageY;
                mouseX -= _this.canvas.offsetLeft;
                mouseY -= _this.canvas.offsetTop;

                //Colision souris/obstacle
                for(this.ob of _this.obManager.obstacles){
                    var dist = Math.sqrt(Math.pow(mouseX - this.ob.getX(), 2) + Math.pow(mouseY - this.ob.getY(), 2)-1000);
                    if(dist < this.ob.radius){
                        _this.clearCanvas();
                    }
                }

                ///////////////////////////
                if (_this.paint) {
                    _this.addClick(mouseX, mouseY, true);
                    _this.redraw();
                }
                e.preventDefault();
            }
        };
        var canvas = document.getElementById("playGround");
        
        canvas.width = document.getElementById("playPanel").offsetWidth;
        canvas.height = document.getElementById("playPanel").offsetHeight;
        //canvas.style.width = document.getElementById("playPanel").offsetWidth;
        //canvas.style.height = document.getElementById("playPanel").offsetHeight;
    
        
        var context = canvas.getContext("2d");
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = '#EE5A24';
        
        context.lineWidth = 4;

        this.canvas = canvas;
        this.context = context;
        
        this.obManager = new ObstacleManager(this.canvas.width, this.canvas.height);

        this.addObs.addEventListener("click", function () {
            _this.obManager.addObstacle(canvas,context);
            _this.obManager.draw(context);
            
        });

        this.removeObs.addEventListener("click", function () {
            _this.obManager.removeLastObstacle();
            _this.clearCanvas();
        });

        
        this.redraw();
        this.createUserEvents();
    }
    //create events
    DrawingApp.prototype.createUserEvents = function () {
        console.log("createUserEvents");
        var canvas = this.canvas;
        canvas.addEventListener("mousedown", this.pressEventHandler);
        canvas.addEventListener("mousemove", this.dragEventHandler);
        canvas.addEventListener("mouseup", this.releaseEventHandler);
        //canvas.addEventListener("mouseout", this.cancelEventHandler);
        canvas.addEventListener("touchstart", this.pressEventHandler);
        canvas.addEventListener("touchmove", this.dragEventHandler);
        canvas.addEventListener("touchend", this.releaseEventHandler);
        canvas.addEventListener("touchcancel", this.cancelEventHandler);
    
    };
    //refresh
    DrawingApp.prototype.redraw = function () {
        var clickX = this.clickX;
        var context = this.context;
        var clickDrag = this.clickDrag;
        var clickY = this.clickY;
        for (var i_1 = 0; i_1 < clickX.length; ++i_1) {
            context.beginPath();
            if (clickDrag[i_1] && i_1) {
                context.moveTo(clickX[i_1 - 1], clickY[i_1 - 1]);
            }
            else {
                context.moveTo(clickX[i_1] - 1, clickY[i_1]);
            }
            context.lineTo(clickX[i_1], clickY[i_1]);
            context.stroke();
        }
        context.closePath();
    };
    //add a point
    DrawingApp.prototype.addClick = function (x, y, dragging) {
        this.clickX.push(x);
        this.clickY.push(y);
        this.clickDrag.push(dragging);
    };
    DrawingApp.prototype.clearCanvas = function () {
        //console.log("ok");
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.clickX = [];
        this.clickY = [];
        this.clickDrag = [];
        this.obManager.draw(this.context);
    };
    //remove the current first point of the draw
    DrawingApp.prototype.removeFirstOne = function () {
        if (this.clickX.length > 1) {
            this.clickX = this.clickX.slice(1);
            this.clickY = this.clickY.slice(1);
        }
        else {
            this.clickX = new Array();
            this.clickY = new Array();
        }
    };

    DrawingApp.prototype.getObstaclesManager = function(){
        return this.obManager;
    };

    DrawingApp.prototype.getCanIDraw = function(){
        return this.canIDraw;
    }

    return DrawingApp;
}());
