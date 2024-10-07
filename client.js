import Player from './player.js';
import { resources } from './resource.js';
import { Sprite } from './sprite.js';
import { Vector } from "./grid.js";


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

const heartbeat = new Sprite({
    resource: resources.images.HUD_hb_normal,
    hFrames: 28,
    vFrames: 1,
    frameSize: { width: 28, height: 22 },
    frame: 0,
    position: new Vector(50, 50),
    scale: 1,
    rotation: 0
});





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

const bloodSpat = new Sprite({resource: resources.images.hitsplat, 
    frameSize: {width: 64, height: 64}, 
    hFrames: 10, vFrames: 1,
    position: new Vector(0, 0), 
    frame: 0,
    scale: 1, rotation: 0});

const walkingLegs = new Sprite({resource: resources.images.legswalking,
    frameSize: {width: 15, height: 54},
    hFrames: 16, vFrames: 1,
    position: new Vector(-10, -20),
    frame: 0,
    scale: 10, rotation: 0});    

const playerDead = new Sprite({resource: resources.images.player_dead,
    frameSize: {width: 80, height: 80},
    hFrames: 88, vFrames: 1,
    position: new Vector(0, 0),
    frame: 0,
    scale: 1, rotation: 0});


function gameLoop() {
    if (myPlayerId === 0) { 
        requestAnimationFrame(gameLoop);
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const background = resources.images.background;
    if (background.loaded) {
        ctx.drawImage(background.image, 0, 0, canvas.width, canvas.height);
    }

    if (!allPlayers[myPlayerId].alive) // player is dead
    {
        playerDead.drawImage(ctx, allPlayers[myPlayerId].position.x, allPlayers[myPlayerId].position.y);
    }

    

    if (resources.images.hitsplat.loaded) {
        bloodSpat.drawImage(ctx, 500, 50);
    }

    // Draw the player
    // ctx.fillStyle = player.color;
    // ctx.fillRect(player.x, player.y, 50, 50);

    // Draw other players
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const id in allPlayers) {
        ctx.beginPath();
        const otherPlayer = allPlayers[id];
        ctx.fillStyle = otherPlayer.color;
        ctx.arc(otherPlayer.position.x, otherPlayer.position.y, 10, 10, 0, 2 * Math.PI);
        
        ctx.fillStyle = otherPlayer.color;
        ctx.fill();

        walkingLegs.frame = otherPlayer.currFrame;
        walkingLegs.drawImage(ctx, otherPlayer.position.x, otherPlayer.position.y);
        
        //ctx.fillRect(otherPlayer.position.x, otherPlayer.position.y, 50, 50);
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
    ctx.fillText('HP: ' + allPlayers[myPlayerId].hp, 0, 70);
    ctx.fillText(`Player position x, y: ${allPlayers[myPlayerId].position.x ?? 0}, ${allPlayers[myPlayerId].position.y ?? 0}`, 0, 90);
    
}

gameLoop();