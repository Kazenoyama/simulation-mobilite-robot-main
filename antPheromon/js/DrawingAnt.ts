class DrawingAnt extends Ant {
    canvas = document.createElement('canvas');
    draw:boolean = false;

    constructor(link: string, x:number, y:number, draw:boolean){
        super(link, x, y);

        this.canvas.width = window.innerWidth * 0.75 ;
        this.canvas.height = window.innerHeight * 0.9 ;
        this.canvas.style.width = "auto";
        this.canvas.style.height = "auto";
        this.canvas.style.margin = '0';
        this.canvas.style.position = 'absolute';
        if(!draw) {
            this.canvas.style.opacity = '0';
        }

        let context = this.canvas.getContext("2d");
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = 'rgb(' + 255 + ',0,' + 255 +')';
        context.lineWidth = 1;
        document.body.appendChild(this.canvas);
    }

    override move(x: number, y: number): void {
        let ctx = this.canvas.getContext('2d');
        this.img.style.left = x + 'px';
        this.img.style.top = y + 'px';
        this.x = x;
        this.y = y;

        ctx.lineTo(this.x,this.y);
        ctx.stroke();
    }
}