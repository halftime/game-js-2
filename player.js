import { Vector } from "./grid.js";
//import { resources } from "./resource.js";
import { serverResource } from "./server-resource.js";
import { gameobject } from './GameObject.js';

export default class Player extends gameobject{
    constructor(playerId, websocket = null, x, y, color = "black")
    {
        super ({ position: new Vector(x, y) });
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

        this.currentFrameCount = 0;
        this.previousFrameTime = Date.now();


        this.latestKeyTimeMs = Date.now(); // to prevent key spamming
        this.latestClickTimeMs = Date.now(); // to prevent click spamming

        this.wasAlive = true;
    }

    updatePosition(keyEvent) // return true if position was updated
    {
        //console.log("keyEvent: " + keyEvent);

        let proposedPosition = new Vector(this.position.x, this.position.y);


        if (keyEvent === 'Enter') this.takeDamage(55);
        if (keyEvent === 'ArrowUp') proposedPosition.y -= 5;
        if (keyEvent === 'ArrowDown') proposedPosition.y += 5;
        if (keyEvent === 'ArrowLeft') proposedPosition.x -= 5;
        if (keyEvent === 'ArrowRight') proposedPosition.x += 5;

        if (!serverResource.isWallCollision(proposedPosition))
        {
            this.position.setXY(proposedPosition.x, proposedPosition.y);
            return true;
        }
        return false;
    }

    takeDamage(damage)
    {
        this.hp -= damage;
        if (this.hp <= 0)
        {
            this.hp = 0;
            this.alive = false;
            //this.webSocket.send(JSON.stringify({ type: 'playerDead' }));
        }
    }

    static getRandomColor()
    {
        const color = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'pink', 'brown', 'white'];
        return color[Math.floor(Math.random() * color.length)];
    }

    step(delta, root)
    {
        //if (this.alive) this.updatePosition();
        if (this.alive !== this.wasAlive)
        {
            this.wasAlive = this.alive;
            if (!this.alive) root.removechild(this);
        }
    }

    draw(ctx, x, y)
    {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(x, y, 10, 10, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }


}