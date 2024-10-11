import { gameobject } from "./GameObject.js";

export class HUD extends gameobject {
    constructor({ position, myPlayerObj, color }) {
        super({ });
        //this.width = width;
       // this.height = height;
        this.color = color;
        this.myPlayerObj = myPlayerObj ?? undefined;
    }

    draw(ctx, x, y) {
        if (this.myPlayerObj === undefined) { return; }
        ctx.fillStyle = this.color;
       // ctx.fillRect(x, y, this.width, this.height);
        ctx.fillText(`HP: ${this.myPlayerObj.hp}`, 0, y + 10);
        //ctx.fillText(`Ping: ${pingMs} ms`, 0, y + 20);
       // ctx.fillText(`FPS: ${Math.round(fps)}`, 0, y + y + 30);
        ctx.fillText('Position: ' + this.myPlayerObj.position.x + ', ' + this.myPlayerObj.position.y, 0, y + 40);
    }

        // fps = 1 / (deltaTime / 1000); // from ms to seconds
    // ctx.fillStyle = 'red';
    // ctx.fillText(`FPS: ${Math.round(fps)}`, 0, 10);
    // ctx.fillText(`Players: ${Object.keys(allPlayers).length}`, 0, 30);
    // ctx.fillText(`Ping: ${pingMs} ms`, 0, 50);

    // if (allPlayers[myPlayerId] !== undefined) {
    //     ctx.fillText('HP: ' + allPlayers[myPlayerId].hp, 0, 70);
    //     ctx.fillText(`Player position x, y: ${allPlayers[myPlayerId].position.x ?? 0}, ${allPlayers[myPlayerId].position.y ?? 0}`, 0, 90);
    // }
}