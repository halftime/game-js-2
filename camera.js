import { myEvents } from "./events.js";
import { gameobject } from "./GameObject.js";

export class Camera extends gameobject{
    constructor()
    {
        super({id: "camera"});

        myEvents.on("playerposition", this, posData => {
            console.log("camera got heroposition: " + JSON.stringify(posData));
            this.position = posData; // set camera position
        });
    }
}
