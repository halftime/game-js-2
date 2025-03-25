import { Vector } from "./grid.js";
//import { resources } from "./resource.js";
import { myServerResource } from "./server-resource.js";
import { gameobject } from './GameObject.js';



export default class Player extends gameobject {
    constructor(playerId, websocket = null, x, y, color = "black") {
        super({ position: new Vector(x, y) });
        this.id = playerId;

        Object.defineProperty(this, 'websocket', {
            value: websocket,
            writable: true,  // You can modify it later
            enumerable: false // Exclude it from JSON.stringify
        });

        this.hp = 100;
        this.alive = true;
        //this.position = new Vector(x, y);
        this._prevPosition = new Vector(0, 0);
        this.color = color;
        this.ping = 0;
        this.fps = 0;
        this.currPlayerFrame = 0;


        this.mouseAngle = 0;

        this.currentFrameCount = 0;
        this.previousFrameTime = Date.now();


        this.latestKeyTimeMs = Date.now(); // to prevent key spamming
        this.latestClickTimeMs = Date.now(); // to prevent click spamming%

        this.wasAlive = true;
        this.prevKeyEvent = undefined;
    }

    updatePosition(keyEvent) // return true if position was updated
    {
        let proposedPosition = new Vector(this.position.x, this.position.y); // copy current player position
        let movingDistance = 10;

       // if (keyEvent !== this.prevKeyEvent) movingDistance = 30;

        if (keyEvent === 'Enter' || keyEvent === "Space") this.takeDamage(20);
        if (keyEvent === 'ArrowUp') { proposedPosition.y -= movingDistance; this.mouseAngle = 90; }
        if (keyEvent === 'ArrowDown') { proposedPosition.y += movingDistance;  this.mouseAngle = 270; }
        if (keyEvent === 'ArrowLeft') { proposedPosition.x -= movingDistance; this.mouseAngle = 180; }
        if (keyEvent === 'ArrowRight') { proposedPosition.x += movingDistance; this.mouseAngle = 0; }
        console.log(">>> player position: " + proposedPosition.x + " , " + proposedPosition.y);

        if (myServerResource.isCoordinateValid(proposedPosition.x, proposedPosition.y)) {
            this.step(20);
            this.position.setXY(proposedPosition.x, proposedPosition.y);
            this.prevKeyEvent = keyEvent;
            return true;
        }
        console.log("buhh collision detected");
        return false;
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