import Player from './player.js';


const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d', { alpha: false });


const dpr = window.devicePixelRatio;
const rect = canvas.getBoundingClientRect();

canvas.width = rect.width * dpr;
canvas.height = rect.height * dpr;

ctx.scale(dpr, dpr);

// Set the "drawn" size of the canvas
canvas.style.width = `${rect.width}px`;
canvas.style.height = `${rect.height}px`;


let allPlayers = {};

let myPlayerId = 0;


// Establish a connection to the server
const socket = new WebSocket('ws://localhost:3000');

console.log("connected to ws://localhost:3000");

// add code to detect mouse click and send to server
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Send the click event to the server
    socket.send(JSON.stringify({ type: 'click', x, y }));
});

// Send player's movement to the server
document.addEventListener('keydown', (event) => {
    socket.send(JSON.stringify({ type: 'keydown', keyevent:event.key, playerid : myPlayerId}));
});

let pingMs = 0;

// Handle incoming messages from the server
socket.onmessage = (message) => {
    const data = JSON.parse(message.data);
    if (data.type === 'playerid') {
        myPlayerId = data.playerId;
        return;
    }

    if (data.type === 'ping') { // server sends ping challange, client responds with pong

        console.log("received ws ping: " + data.ping.challangeId);
        let myPingChallange = new PingChallange(data.ping.challangeId, data.ping.initTimestamp, Date.now());
        socket.send(JSON.stringify({ type: 'pong', pong: myPingChallange }));
    }

    if (data.type === 'updatePlayers') {
        allPlayers = data.players;
    }
};

// Render game loop
// capture the ctx framerate and display it on the screen
let fps = 0;
let lastFrameTime = performance.now();


function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the player
    // ctx.fillStyle = player.color;
    // ctx.fillRect(player.x, player.y, 50, 50);

    // Draw other players
    for (const id in allPlayers) {
        const otherPlayer = allPlayers[id];
        ctx.fillStyle = otherPlayer.color;
        ctx.fillRect(otherPlayer.x, otherPlayer.y, 50, 50);
    }

    requestAnimationFrame(gameLoop);

    const currentTime = performance.now();
    const deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;
    fps = 1 / (deltaTime / 1000); // from ms to seconds
    ctx.fillStyle = 'red';
    ctx.fillText(`FPS: ${Math.round(fps)}`, 0, 10);
    ctx.fillText(`Players: ${Object.keys(allPlayers).length}`, 0, 30);
    ctx.fillText(`Ping: ${pingMs} ms`, 0, 50);
}

gameLoop();