import Player from './player.js';
import { resources } from './resource.js';
import { Sprite } from './sprite.js';
import { Vector } from "./grid.js";
import { GameLoop } from './gameloop.js';
import { FrameIndexPattern } from './FrameIndexPattern.js';
import { DEADFRAMES, HEARTBEATOKFRAMES } from './animations.js';
import { gameobject } from './GameObject.js';
import { heartbeatSprite, walkingLegsSprite, backgroundSprite } from './sprites.js';


const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d', { alpha: false });
const dpr = window.devicePixelRatio;
ctx.scale(dpr, dpr);
const rect = canvas.getBoundingClientRect();



canvas.width = rect.width * dpr;
canvas.height = rect.height * dpr;

canvas.style.width = `${rect.width}px`;
canvas.style.height = `${rect.height}px`;

let allPlayers = {};
let myPlayerId = 0;

const mainScene = new gameobject({ });



mainScene.addChild(backgroundSprite);
mainScene.addChild(heartbeatSprite);




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
    //console.log("key pressed: " + event.key + " playerid: " + myPlayerId);;
    socket.send(JSON.stringify({ type: 'keydown', keyevent: event.key, playerid: myPlayerId }));
});

let pingMs = 0;
let myPlayer = undefined;

socket.onmessage = (message) => {
    const data = JSON.parse(message.data);
    if (data.type === 'newPlayer') {
        console.log("my player object added: " + JSON.stringify(data.playerObj));
        myPlayerId = data.playerObj.id;
        //allPlayers[data.playerObj.id] = new Player(data.playerObj);



        //myPlayer = new Player(data.playerObj);
        //console.log("my player object added: " + JSON.stringify(myPlayer));
        //console.log("my player position: " + myPlayer.position.x + ", " + myPlayer.position.y);
        //mainScene.addChild(myPlayer);
        // mainScene.addChild(data.playerObj);

        return;
    }

    if (data.type === 'ping') { // server sends ping challange, client responds with pong

        console.log("received ws ping: " + data.ping.challangeId);
        let myPingChallange = new PingChallange(data.ping.challangeId, data.ping.initTimestamp, Date.now());
        socket.send(JSON.stringify({ type: 'pong', pong: myPingChallange }));
    }

    if (data.type === 'updatePlayers') {
        //console.log("updatePlayers: " + JSON.stringify(data.players));
        for (const id in data.players) {
            if (allPlayers[id] !== undefined) {
                allPlayers[id].position = new Vector(data.players[id].position.x, data.players[id].position.y);
                allPlayers[id].hp = data.players[id].hp;
                allPlayers[id].alive = data.players[id].alive;
                allPlayers[id].currPlayerFrame = data.players[id].currPlayerFrame;
                allPlayers[id].color = data.players[id].color;
                // allPlayers[id].ping = data.players[id].ping;
                // allPlayers[id].fps = data.players[id].fps;
                //allPlayers[id].latestKeyTimeMs = data.players[id].latestKeyTimeMs;
                //allPlayers[id].latestClickTimeMs = data.players[id].latestClickTimeMs;
            }
            else {
                const player = data.players[id];
                allPlayers[player.id] = new Player(data.players[id]);
                console.log("player added: " + player.id);

            }
            //mainScene.addChild(allPlayers[id]);
            //console.log("player added: " + player.id);
        }
        //allPlayers = data.players;
    }

    if (data.type === 'playerDead') {
        console.log("player dead: " + data.playerId);
        //playerDead.drawAllFrames(ctx, allPlayers[data.playerId].position.x, allPlayers[data.playerId].position.y);
    }
};

// Render game loop
// capture the ctx framerate and display it on the screen
let fps = 0;


const bloodSpat = new Sprite({
    resource: resources.images.hitsplat,
    frameSize: { width: 64, height: 64 },
    hFrames: 10, vFrames: 1,
    position: new Vector(0, 0),
    frame: 0,
    scale: 1, rotation: 0
});

const update = (delta) => {
    ///console.log("update delta: " + delta);
    mainScene.step(delta, mainScene);
    for (const id in allPlayers) {
        allPlayers[id].step(delta);
    }
}


// const heroPlayer = new Player({ position: new Vector(100, 100), color: 'blue' });
// mainScene.addChild(heroPlayer);

let lastFrameTime = performance.now();

const draw = () => {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    mainScene.draw(ctx, 0, 0);
    for (const id in allPlayers) {
        let otherPlayer = allPlayers[id];
        otherPlayer.addChild(walkingLegsSprite);
        console.log("otherPlayer: " + otherPlayer.children.length);
        otherPlayer.draw(ctx, otherPlayer.position.x, otherPlayer.position.y);
    }

    console.log(mainScene.children.length);

    //mainScene.addChild(myPlayer);

    // let myPlayer = allPlayers[myPlayerId];
    // if (myPlayer !== null && myPlayer !== undefined) {
    // mainScene.addChild(myPlayer);

    //background.drawImage(ctx, 0, 0);


    // for (const id in allPlayers) {
    //     const otherPlayer = allPlayers[id];

    //     if (otherPlayer.alive || otherPlayer.hp > 0) {
    //         ctx.beginPath();
    //         ctx.fillStyle = otherPlayer.color;
    //         ctx.arc(otherPlayer.position.x, otherPlayer.position.y, 10, 10, 0, 2 * Math.PI);
    //         walkingLegs.frame = otherPlayer.currPlayerFrame % walkingLegs.hFrames;
    //         walkingLegs.drawImage(ctx, otherPlayer.position.x, otherPlayer.position.y);
    //         ctx.fill();
    //         ctx.closePath();
    //     }
    //     else
    //     {
    //         playerDead.step(deltaTime);
    //         playerDead.drawImage(ctx, otherPlayer.position.x, otherPlayer.position.y);
    //     }
    // }


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

let gameLoop = new GameLoop(update, draw);
gameLoop.start();
