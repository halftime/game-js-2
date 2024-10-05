export default class Player {
    constructor(playerId, webSocket, color = Player.getRandomColor())
    {
        this.id = playerId;
        this.webSocket = webSocket;

        this.hp = 100;
        this.x = 200;
        this.y = 200;
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
        console.log("updating player position: " + keyEvent);
        if (keyEvent === 'ArrowUp') this.y -= 5;
        if (keyEvent === 'ArrowDown') this.y += 5;
        if (keyEvent === 'ArrowLeft') this.x -= 5;
        if (keyEvent === 'ArrowRight') this.x += 5;
        this.latestKeyTimeMs = currentTime;
    }

    static getRandomColor()
    {
        const color = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'pink', 'brown', 'white'];
        return color[Math.floor(Math.random() * color.length)];
    }


}