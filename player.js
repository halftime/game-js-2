import { Vector } from "./grid.js";
//import { resources } from "./resource.js";
//import { myServerResource } from "./server-resource.js";
import { gameobject } from './GameObject.js';
import { walkingLegsSprite } from './sprites.js';



export default class Player extends gameobject {
    constructor(playerid, websocket = null, x, y, color = "black") {
        super({id: playerid, position: new Vector(x, y) });

        Object.defineProperty(this, 'websocket', {
            value: websocket,
            writable: true,  // You can modify it later
            enumerable: false // Exclude websocket from JSON.stringify
        });

        this.playerid = playerid;
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

    drawImage(ctx, x, y) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.position.x, this.position.y, 10, 10, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }


}