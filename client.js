import Player from './player.js';
import { resources } from './resource.js';
import { Sprite } from './sprite.js';
import { Vector } from "./grid.js";
import { GameLoop } from './gameloop.js';
import { FrameIndexPattern } from './FrameIndexPattern.js';
import { DEADFRAMES, HEARTBEATOKFRAMES } from './animations.js';
import { gameobject } from './GameObject.js';
import { heartOKSprite, heartCriticalSprite, heartImpactedSprite, walkingLegsSprite, backgroundSprite, playerDeadSprite } from './sprites.js';
import { HUDOverlay } from './HUD.js';


const gameCanvas = document.getElementById('gameCanvas');
const uiCanvas = document.getElementById('uiCanvas');

const gameCtx = gameCanvas.getContext('2d');
const uiCtx = uiCanvas.getContext('2d');

const dpr = window.devicePixelRatio;
gameCtx.scale(dpr, dpr);
const rect = gameCanvas.getBoundingClientRect();

function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

gameCanvas.width = rect.width * dpr;
gameCanvas.height = rect.height * dpr;

gameCanvas.style.width = `${rect.width}px`;
gameCanvas.style.height = `${rect.height}px`;

let allPlayers = {};
let myPlayerId = 0;

const mainScene = new gameobject({ position: new Vector(0, 0), uniqudId: 'mainScene' });


mainScene.addChild(backgroundSprite);
//mainScene.addChild(heartOKSprite);


// Establish a connection to the server
const socket = new WebSocket('ws://localhost:3000');
console.log("connected to ws://localhost:3000");

let myMouseAngleDeg = 0;

gameCanvas.addEventListener('mousemove', (evt) => {
    const mousePos = getMousePos(gameCanvas, evt);
    if (myPlayerId === 0) return;
    const mouseAngle = Math.atan2(mousePos.y - allPlayers[myPlayerId].position.y, mousePos.x - allPlayers[myPlayerId].position.x);
    //console.log("mouse angle: " + mouseAngle);
    myMouseAngleDeg = mouseAngle * 180 / Math.PI;
    socket.send(JSON.stringify({ type: 'mousemove', mousePos: mousePos }));
}
);

gameCanvas.addEventListener('click', (event) => {
    const rect = gameCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    socket.send(JSON.stringify({ type: 'click', x, y }));
});

document.addEventListener('keydown', (event) => {
    socket.send(JSON.stringify({ type: 'keydown', keyevent: event.key, playerid: myPlayerId }));
});

let pingMs = 0;
let myPlayer = undefined;

socket.onmessage = (message) => {
    const data = JSON.parse(message.data);
    if (data.type === 'newPlayer') {
        console.log("my player object added: " + JSON.stringify(data.playerObj));
        myPlayerId = data.playerObj.id;
        myPlayer = data.playerObj;
        console.log("my player >>>>: " + JSON.stringify(myPlayer));

        //PlayerHUD.step(16);
        //mainScene.addChild(PlayerHUD);
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
                allPlayers[id].ping = data.players[id].ping;
                allPlayers[id].fps = data.players[id].fps;
                allPlayers[id].suggAngleDeg = data.players[id].suggAngleDeg;
            }
            else {
                const player = data.players[id];
                allPlayers[player.id] = new Player(data.players[id]);
                console.log("player added: " + player.id);
            }
        }
    }

    if (data.type === 'playerDead') {
        console.log("player dead: " + data.playerId);
        mainScene.addChild(playerDeadSprite);
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
    scale: 1, rotationDeg: 0
});

const update = (delta) => {
    ///console.log("update delta: " + delta);
    //mainScene.step(delta, mainScene);
    mainScene.step(delta, null);
    // for (const id in allPlayers) {
    //     //allPlayers[id].step(delta);
    // }
}


// const heroPlayer = new Player({ position: new Vector(100, 100), color: 'blue' });
// mainScene.addChild(heroPlayer);

let lastFrameTime = performance.now();


   // myHud.drawImage(ctx, 0, canvas.height - 100);

    

const draw = () => {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastFrameTime;

    lastFrameTime = currentTime;
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    uiCtx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);

    mainScene.draw(gameCtx, 0, 0);
    for (const id in allPlayers) {
        let otherPlayer = allPlayers[id];
        walkingLegsSprite.offsetX = otherPlayer.position.x;
        walkingLegsSprite.offsetY = otherPlayer.position.y;
        walkingLegsSprite.rotationDeg = myMouseAngleDeg;
        walkingLegsSprite.rotationDeg = otherPlayer.suggAngleDeg;
        //console.log("player rotation: " + otherPlayer.suggAngleDeg);
        otherPlayer.addChild(walkingLegsSprite);
        otherPlayer.draw(gameCtx, otherPlayer.position.x, otherPlayer.position.y);
    }
    //console.log("delta frame time ms: " + deltaTime);
    
    //myHud.draw(ctx);
    //myHud.step(deltaTime);
    //myHud.draw(ctx, 0, canvas.height - 100);
    //mainScene.addChild(myHud);
    if (allPlayers[myPlayerId] === undefined) return;
    
    const myHud = new HUDOverlay({ position: new Vector(0, uiCanvas.height - 100), myPlayerObj: allPlayers[myPlayerId], color: 'red', frameTimeMs: 0, mainSceneObj: mainScene });
    myHud.draw(uiCtx, 0, uiCanvas.height - 100);
    //mainScene.addChild(myHud);

    //myHud.draw(ctx, 0, canvas.height - 100);
    // mainScene.removechild(heartOKSprite);
    // mainScene.removechild(heartCriticalSprite);
    // mainScene.removechild(heartImpactedSprite);


    
        //console.log("my player position: " + allPlayers[myPlayerId].position.x + ", " + allPlayers[myPla
    console.log(mainScene.children.size);

    //const PlayerHUD = new HUDOverlay(new Vector(0, 0), myPlayer, 'red');
    //PlayerHUD.draw(ctx, 0, 0);
}

let gameLoop = new GameLoop(update, draw);
gameLoop.start();
