let mouseX:number;
let mouseY:number;

window.onload = () => {

    window.addEventListener("contextmenu", e => e.preventDefault());

    document.addEventListener('mousemove', function(e){
        mouseX = e.clientX; // Gets Mouse X
        mouseY = e.clientY;

        if((window as any).drag != null){
            (window as any).drag.img.style.left = mouseX + 'px';
            (window as any).drag.img.style.top = mouseY + 'px';
            (window as any).drag.x = mouseX;
            (window as any).drag.y = mouseY;

            for(let key of Array.from((window as any).drag.linkedIslands.keys())){
                Islands.forEach(function(island) {
                    if (island.linkedIslands.has(key) && !(island.isEqual((window as any).drag))){
                        AllLines.get(key).updateCanvasLinked();
                    }
                });      
            }
        }

        if(isPathDrawing) {
            AllLines.get(keyPath).x1 = mouseX;
            AllLines.get(keyPath).y1 = mouseY;
            AllLines.get(keyPath).updateCanvas();
        }
    });


    document.addEventListener('keydown',function(event){
        if(event.code == 'Backspace' && (window as any).drag != null){
            (window as any).drag.draw = false;
            
            document.body.removeChild((window as any).drag.img);
            for(let key of Array.from((window as any).drag.linkedIslands.keys())){
                Islands.forEach(function(island) {
                    if (island.linkedIslands.has(key) && !(island.isEqual((window as any).drag))){
                        document.body.removeChild(AllLines.get(key).canvas);
                        island.linkedIslands.delete(key);
                        AllLines.delete(key);
                    }
                });
            }

            for(let i:number=0;i<Islands.length;i++){
                if(Islands[i].isEqual((window as any).drag)) {
                    Islands.splice(i,1);
                }
            }
            (window as any).drag = null;
        } 
    });

   
    (document.getElementById('selectIsland') as HTMLOptionElement).addEventListener('click', function(event) {
        Islands.push(new Island());
        Islands[Islands.length-1].moveTo(event.clientX,event.clientY);
    });
    

    (document.getElementById('selectAnthill') as HTMLOptionElement).addEventListener('click', function(event) {
        Islands.push(new IslandAnthill());
        Islands[Islands.length-1].moveTo(event.clientX,event.clientY);
    });
    

    (document.getElementById('selectFood') as HTMLOptionElement).addEventListener('click', function(event) {
        Islands.push(new IslandFood());
        Islands[Islands.length-1].moveTo(event.clientX,event.clientY);
    });

}

function main(){

    for(let key of Array.from(AllLines.keys())){
        AllLines.get(key).updateCanvasLinked();
    }

    spawnAnts();
    moveAnts();
    reducePheromones();

    setTimeout(main, 10);
}

function spawnAnts(){
    Islands.forEach(function(island) {
        if(island instanceof IslandAnthill) {
            island.spawnAnts();
        }
    });

}

function moveAnts(){
    Islands.forEach(function(island) {
        if(island instanceof IslandAnthill) {
            for(let ant of island.colonyAnts){
                ant.updatePosition();
            }
        }
    });  
}

function reducePheromones(){
    // let i:number=0;
    // Islands.forEach(function(island) {
    //     if(island instanceof IslandAnthill) {
    //         for(let ant of island.colonyAnts){
    //             i++;
    //         }
    //     }
    // });  

    for(let key of Array.from(AllLines.keys())){
        for(let i = 0; i < AllLines.get(key).pheromones.length; i++){
            AllLines.get(key).pheromones[i][0] = Math.max(0.01,(AllLines.get(key).pheromones[i][0] - Antspeed * 0.001));
            AllLines.get(key).pheromones[i][1] = Math.max(0.01,(AllLines.get(key).pheromones[i][1] - Antspeed * 0.001));
        }
    }
}