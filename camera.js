import { myEvents } from "./events.js";
import { gameobject } from "./GameObject.js";
import { Vector } from "./grid.js";

export class Camera extends gameobject{
    constructor()
    {
        super({position: new Vector(0, 0), id: "camera"});

        const playerWidth = 10;
        const canvasWidth = 700;
        const canvasHeight = 500;

        const halfWidth = canvasWidth / 2;
        const halfHeight = canvasHeight / 2;

        const mapWidth = 1151;
        const mapHeight = 791;



        myEvents.on("playerposition", this, posData => {
            console.log("camera got playerposition event: " + JSON.stringify(posData));
            
            const newPosition = new Vector(posData.x + canvasWidth / 2, posData.y + canvasHeight / 2);

            this.position.x =  newPosition.x;
            this.position.y =  newPosition.y;
            console.log("camera position: " + JSON.stringify(this.position));
        });
    }
}
