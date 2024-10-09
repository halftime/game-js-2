import { Vector } from "./grid.js";
//import { resources } from "./resource.js";
import { serverResource } from "./server-resource.js";

export default class Player {
    constructor(playerId, webSocket, color = Player.getRandomColor())
    {
        this.id = playerId;

        Object.defineProperty(this, 'webSocket', {
            value: webSocket,
            writable: true,  // You can modify it later
            enumerable: false // Exclude it from JSON.stringify
        });

        this.hp = 100;
        this.alive = true;
        // this.x = 200;
        // this.y = 200;
        this.position = new Vector(200, 200);
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

    updatePosition(keyEvent)
    {
        const pixelConst = 5;
        const currentTime = Date.now();
        if (currentTime - this.latestKeyTimeMs < 10) return;
        console.log("keyEvent: " + keyEvent);

        let proposedPosition = new Vector(this.position.x, this.position.y);


        if (keyEvent === 'Enter') this.takeDamage(55);
        if (keyEvent === 'ArrowUp') proposedPosition.y -= 5;
        if (keyEvent === 'ArrowDown') proposedPosition.y += 5;
        if (keyEvent === 'ArrowLeft') proposedPosition.x -= 5;
        if (keyEvent === 'ArrowRight') proposedPosition.x += 5;

        if (!serverResource.isWallCollision(proposedPosition))
        {
            console.log("no wall collision detected: " + proposedPosition.x + " , " + proposedPosition.y);
            this.position = proposedPosition;
        }
        else
        {
            console.log("wall collision detected");
        }

        // const walls_range_x = [50, 910];
        // const walls_range_y = [50, 660];

        // if (this.position.x > walls_range_x[1]) this.position.x -= 5;
        // if (this.position.x < walls_range_x[0]) this.position.x += 5;
        // if (this.position.y > walls_range_y[1]) this.position.y -= 5;
        // if (this.position.y < walls_range_y[0]) this.position.y += 5;

        this.latestKeyTimeMs = currentTime;
        if (this.position.x !== this._prevPosition.x || this.position.y !== this._prevPosition.y)
        {
            this._prevPosition = new Vector(this.position.x, this.position.y);
           // this.currPlayerFrame = (this.currPlayerFrame + 1) % 32; // shouldnt be an issue, prevent overflow of frame count
            console.log("player position updated: " + this.position.x + ", " + this.position.y);
        }
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


}