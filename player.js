import { Vector } from "./grid.js";

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
        // this.x = 200;
        // this.y = 200;
        this.position = new Vector(200, 200);
        this.color = color;
        this.ping = 0;
        this.fp = 0;


        this.latestKeyTimeMs = Date.now(); // to prevent key spamming
        this.latestClickTimeMs = Date.now(); // to prevent click spamming
    }

    updatePosition(keyEvent)
    {
        const currentTime = Date.now();
        if (currentTime - this.latestKeyTimeMs < 100) return;
        if (keyEvent === 'ArrowUp') this.position.y -= 5;
        if (keyEvent === 'ArrowDown') this.position.y += 5;
        if (keyEvent === 'ArrowLeft') this.position.x -= 5;
        if (keyEvent === 'ArrowRight') this.position.x += 5;
        this.latestKeyTimeMs = currentTime;
    }

    static getRandomColor()
    {
        const color = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'pink', 'brown', 'white'];
        return color[Math.floor(Math.random() * color.length)];
    }


}