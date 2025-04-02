import { Vector } from "./grid.js";
//import { resources } from "./resource.js";
//import { myServerResource } from "./server-resource.js";
import { gameobject } from './GameObject.js';
import { walkingLegsSprite } from './sprites.js';
import { myEvents } from "./events.js";


export default class Player extends gameobject {
    constructor(playerid, websocket, x, y, color = "black", username) {
        super({id: playerid, position: new Vector(x, y) });

         Object.defineProperty(this, 'websocket', {
             value: websocket,
             writable: true,  // You can modify it later
             enumerable: false // Exclude websocket from JSON.stringify
         });

        //this.playerid = playerid;
        this.username = username;
        this.hp = 100;
        this.alive = true;
        this.color = color;
        this.ping = 0;
        this.fps = 0;
        this.currPlayerFrame = 0;

        this.latestMousePos = new Vector(0, 0);
        this.latestMouseAngle = 0; // angle in degrees
        this.latestMouseMoveTimeMs = Date.now();

        this.currentFrameCount = 0;
        this.previousFrameTime = Date.now();

        this.latestKeyTimeMs = Date.now(); // to prevent key spamming
        this.latestClickTimeMs = Date.now(); // to prevent click spamming

        this.wasAlive = true;
        this.prevKeyEvent = undefined;

        this.prevPosition = new Vector(0, 0);

        console.log("Player created: " + JSON.stringify(this));
        console.log(".positon: " + JSON.stringify(this.position));
        console.log("prev position: " + JSON.stringify(this.prevPosition));

    }

    takeDamage(damage) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.hp = 0;
            this.alive = false;
            //this.webSocket.send(JSON.stringify({ type: 'playerDead' , playerid: this.id }));
        }
        return;
    }

    static getRandomColor() {
        const color = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'pink', 'brown', 'white'];
        return color[Math.floor(Math.random() * color.length)];
    }

    // step(delta, root)
    // {
    //     //if (this.alive) this.updatePosition();
    //     if (this.alive !== this.wasAlive)
    //     {
    //         this.wasAlive = this.alive;
    //         if (!this.alive) root.removechild(this);
    //     }
    // }

    drawImage(ctx, x, y) { // override, draw player as circle
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.position.x, this.position.y, 10, 10, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        this.tryEmitPosition(); // emit position if it has changed, also updates prevPosition
    }

    tryEmitPosition() {
        if (this.position.x === this.prevPosition.x && this.position.y === this.prevPosition.y) {
            return;
        }
        this.prevPosition = new Vector(this.position.x, this.position.y);
        //console.log("position EMITTED" + JSON.stringify(this.position));
        myEvents.emit("playerposition", this.position);
    }


}