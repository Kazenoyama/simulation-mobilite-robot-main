class IslandAnthill extends Island {
    colonyNumber:number = 0;
    colonyAnts = new Array<Ant>();

    constructor(){
        super();
        this.img.src = "./assets/IslandAnthill.png";
        this.img.style.top = '40%';
    }

    spawnAnts(){
        if(this.colonyAnts.length > 0) {
            if(Math.sqrt((this.colonyAnts[this.colonyAnts.length-1].x - this.x)*(this.colonyAnts[this.colonyAnts.length-1].x - this.x) + (this.colonyAnts[this.colonyAnts.length-1].y - this.y)*(this.colonyAnts[this.colonyAnts.length-1].y - this.y)) > 1 && this.colonyAnts.length < (Islands.length * 100)) {
                this.colonyAnts.push(new Ant('./assets/ant.png',30,30,this.colonyNumber));
                this.colonyAnts[this.colonyAnts.length-1].move(this.x,this.y);
                this.colonyAnts[this.colonyAnts.length-1].previousIsland = this;
                this.colonyAnts[this.colonyAnts.length-1].targetIsland = this;

                document.body.appendChild(this.colonyAnts[this.colonyAnts.length-1].img)
            }
        } else {
                this.colonyAnts.push(new Ant('./assets/ant.png',30,30,this.colonyNumber)); 
                this.colonyAnts[this.colonyAnts.length-1].move(this.x,this.y);
                this.colonyAnts[this.colonyAnts.length-1].previousIsland = this;
                this.colonyAnts[this.colonyAnts.length-1].targetIsland = this;

                document.body.appendChild(this.colonyAnts[this.colonyAnts.length-1].img)
        }
    }
}