let keyPath:number = 1;
let isPathDrawing:boolean = false;
let Islands = new Array();
let AllLines = new Map();

class Island {
    x:number;
    y:number;
    img = document.createElement('img');
    drag:boolean = true;
    linkedIslands = new Map();

    constructor(){
        this.img.src = './assets/Island.png';
        this.img.style.position = 'absolute';
        this.img.style.transform = 'translateX('+-50+'%) translateY('+-50+'%)';
        this.img.style.width = 100+'px';
        this.img.style.height = 100+'px';
        this.img.style.left = '90%';
        this.img.style.top = '20%';
        this.img.style.cursor = 'pointer';

        document.body.appendChild(this.img);

        (window as any).drag = this.drag ? this : null;
        this.img.addEventListener('mousedown',function(event){

            if(event.button == 2) {
                if(!isPathDrawing){

                    let bridge = new Bridge(this.x,this.y,this);
                    AllLines.set(keyPath,bridge);
                    (window as any).draw = this;

                    isPathDrawing = !isPathDrawing;

                } else if(!(window as any).draw.isEqual(this)){
                    let bridge = AllLines.get(keyPath);
                    bridge.island1 = this;
                    bridge.x0 = (window as any).draw.x;
                    bridge.y0 = (window as any).draw.y;
                    bridge.x1 = this.x;
                    bridge.y1 = this.y;
                    bridge.updateCanvas();

                    (window as any).draw.linkedIslands.set(keyPath,new Array(this, 0));
                    this.linkedIslands.set(keyPath,new Array((window as any).draw, 1));

                    isPathDrawing = !isPathDrawing;
                    keyPath ++;
                }
            } 

            if(event.button == 0 && this.x < (window.innerWidth *0.76) && this.y < (window.innerHeight *0.95)) {
                this.drag = !this.drag;
                (window as any).drag = this.drag ? this : null;
            }
        }.bind(this));

    }

    moveTo(x:number,y:number){
        this.x = x;
        this.y = y;
        this.img.style.left = x+'px';
        this.img.style.top = y+'px';
    }

    isEqual(o:Island): boolean{
        return (this.x == o.x && this.y == o.y);
    }

    
   
}

