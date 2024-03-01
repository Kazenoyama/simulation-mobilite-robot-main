let Antspeed:number = 10;
let BeforePheromone:number = 0.015;
let AfterPheromone:number = 0.05;


class Ant{
    //image, speed, pos, distance
    img = document.createElement('img');
    speedX:number = 0;
    speedY:number = 0;
    colony:number = 0;
    previousIsland:Island;
    targetIsland:Island;
    x:number;
    y:number;
    backward:boolean = false;

    //ant constructor
    constructor(link: string, x:number, y:number, colony:number){
        this.colony = colony;
        this.img.src = link;
        this.img.style.position = 'absolute';
        this.img.style.transform = 'translateX('+-50+'%) translateY('+-50+'%)';
        this.img.style.width = x+'px';
        this.img.style.height = y+'px';
    }

    //teleport the ant to x and y, update distance and coordonates
    move(x:number, y:number){
        this.img.style.left = x + 'px';
        this.img.style.top = y + 'px';
        this.x = x;
        this.y = y;
    }

    isOnIsland(): boolean{
        return (Math.abs(this.targetIsland.x - this.x) < 10 && Math.abs(this.targetIsland.y - this.y) < 10);
    }

   
    followIsland(island:Island) {
        let dx:number = island.x - this.x;
        let dy:number = island.y - this.y;

        if(Math.max(Math.abs(dx),Math.abs(dy)) >= Antspeed) {
            this.speedX = dx / Math.max(Math.abs(dx),Math.abs(dy)) * Antspeed;
            this.speedY = dy / Math.max(Math.abs(dx),Math.abs(dy)) * Antspeed;
        } else {
            this.speedX = dx;
            this.speedY = dy;
        }

        let angl:number = Math.atan(dy/dx)  * 180/Math.PI;
        if(dx < 0){
            this.img.style.transform = 'translateX('+-50+'%) translateY('+-50+'%) rotate(' + (-90+angl) + 'deg) '; 
        } else {
            this.img.style.transform = 'translateX('+-50+'%) translateY('+-50+'%) rotate(' + ((-90-angl) * (-1)) + 'deg) '; 
        }
        
        this.move(this.x + this.speedX, this.y + this.speedY);
    }

    updatePosition(){

        if(this.isOnIsland()) {
           this.choseNewTarget();
        } 

        this.followIsland(this.targetIsland);
    }
    
    choseNewTarget(){
        let currentIsland = this.targetIsland;
        let targetIsland;

        if(this.previousIsland != currentIsland) {
            for(let key of Array.from(currentIsland.linkedIslands.keys())){
                if(this.previousIsland.linkedIslands.has(key)){
                    if(this.backward == true){
                        AllLines.get(key).pheromones[this.colony][currentIsland.linkedIslands.get(key)[1]] += AfterPheromone;
                    } else {
                        AllLines.get(key).pheromones[this.colony][currentIsland.linkedIslands.get(key)[1]] += BeforePheromone;
                    }
                }
            }
        }

        if(currentIsland.linkedIslands.size == 1) {
            for(let key of Array.from(currentIsland.linkedIslands.keys())){
                targetIsland = currentIsland.linkedIslands.get(key)[0];
                this.updatePheromone(key,currentIsland);
            }

        } else {

            let sum:number = 0;
            let tar:number = 0;
            let once:boolean = true;
            for(let key of Array.from(currentIsland.linkedIslands.keys())){
                if(!this.targetIsland.linkedIslands.get(key)[0].isEqual(this.previousIsland) || (currentIsland instanceof IslandFood && this.backward == false) || (currentIsland instanceof IslandAnthill && this.backward == true)){
                    sum += (AllLines.get(key).pheromones[this.colony][currentIsland.linkedIslands.get(key)[1]]);
                }
            }
            tar = sum * Math.random();
            sum = 0;
            for(let key of Array.from(currentIsland.linkedIslands.keys())){
                if(!this.targetIsland.linkedIslands.get(key)[0].isEqual(this.previousIsland) || (currentIsland instanceof IslandFood && this.backward == false) || (currentIsland instanceof IslandAnthill && this.backward == true)){
                    sum += (AllLines.get(key).pheromones[this.colony][currentIsland.linkedIslands.get(key)[1]]);

                    if(sum >= tar && once) {
                        let choosenkey = key;
                        targetIsland = currentIsland.linkedIslands.get(key)[0];
                        this.updatePheromone(choosenkey,currentIsland);
                        once = false;
                    }
                }
            }
        }

        this.previousIsland = currentIsland;
        this.targetIsland = targetIsland;
            
    }


    updatePheromone(choosenkey:number, currentIsland:Island){
        
        if((currentIsland instanceof IslandAnthill) && this.backward == true){
            this.backward = false;
            this.img.src = './assets/ant.png';
        }

        if(currentIsland instanceof IslandFood && this.backward == false) {
            this.backward = true;
            this.img.src = './assets/antFood.png';
        }

        if(this.backward == true){
            AllLines.get(choosenkey).pheromones[this.colony][currentIsland.linkedIslands.get(choosenkey)[1]] += AfterPheromone;
        } else {
            AllLines.get(choosenkey).pheromones[this.colony][currentIsland.linkedIslands.get(choosenkey)[1]] += BeforePheromone;
        }
        
    }

    isAnt(ant:Ant): boolean{
        return (ant.x == this.x && ant.y == this.y);
    }

    removeAnt(){
        Islands.forEach(function(island) {
            if(island instanceof IslandAnthill) {
                if(island.colonyNumber == this.colony){
                    for(let i=0; i < island.colonyAnts.length; i++){
                        if(island.colonyAnts[i].isAnt(this)){
                            island.colonyAnts.splice(i,1);
                            document.body.removeChild(this.img);
                        }
                    }
                }
            }
        }.bind(this));
    }
    
}