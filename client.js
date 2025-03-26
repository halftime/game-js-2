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

const serverPort = 5501;
const serverUrl = `ws://localhost:${serverPort}`;

const radToDeg = 180 / Math.PI;

const gameCanvas = document.getElementById('gameCanvas');
const uiCanvas = document.getElementById('uiCanvas');

const gameCtx = gameCanvas.getContext('2d');
const uiCtx = uiCanvas.getContext('2d');

const dpr = window.devicePixelRatio;
gameCtx.scale(dpr, dpr);
const rect = gameCanvas.getBoundingClientRect();

function getMousePos(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

gameCanvas.width = rect.width * dpr;
gameCanvas.height = rect.height * dpr;

gameCanvas.style.width = `${rect.width}px`;
gameCanvas.style.height = `${rect.height}px`;

let allPlayers = new Map();
let myPlayerId = 0;

const mainScene = new gameobject({ position: new Vector(0, 0), id: 'mainscene' });
mainScene.addChild(backgroundSprite);
const socket = new WebSocket(serverUrl);

document.addEventListener('click', (event) => {
    socket.send(JSON.stringify({ type: 'mouseclick', mousePos: getMousePos(gameCanvas, event), playerId: myPlayerId }));
});


document.addEventListener('mousemove', (event) => {
    if (myPlayerId === 0 || allPlayers.has(myPlayerId) === false) return;
    const myPlayer = allPlayers.get(myPlayerId);
    const mousePos = getMousePos(gameCanvas, event);
    const myMouseAngleDeg = Math.round(Math.atan2(mousePos.y - myPlayer.position.y, mousePos.x - myPlayer.position.x) * radToDeg * 100) / 100;

    // console.log("Mouse position (x, y): " + mousePos.x + " , " + mousePos.y);
    // console.log("Mouse angle (in deg 0-360)" + myMouseAngleDeg);
    socket.send(JSON.stringify({ type: 'mousemove', latestMousePos: mousePos, latestMouseAngle: myMouseAngleDeg, playerId: myPlayerId }));
    //socket.emit('mousemove', { mousePos: mousePos, mouseAngle: myMouseAngleDeg, playerId: myPlayerId });
});

document.addEventListener('keydown', (event) => {
    console.log("key pressed: " + event.key);
    socket.send(JSON.stringify({ type: 'keydown', keyevent: event.key, playerid: myPlayerId }));
});

let pingMs = 0;
let myPlayer = undefined;

socket.onmessage = (message) => {
    const data = JSON.parse(message.data);
    if (data.type === 'newplayer') {
        console.log("my player object added: " + JSON.stringify(data.playerObj));
        myPlayerId = data.playerObj.id;
        // const newPlayer = new Player(data.playerObj.id, socket, data.playerObj.position.x, data.playerObj.position.y, data.playerObj.color);
        // console.log("new player >>>>: " + JSON.stringify(newPlayer));
        // allPlayers.set(data.playerId, newPlayer);

        return;
    }

    if (data.type === 'ping') { // server sends ping challange, client responds with pong
        console.log("received ws ping: " + data.ping.challangeId);
        let myPingChallange = new PingChallange(data.ping.challangeId, data.ping.initTimestamp, Date.now());
        socket.send(JSON.stringify({ type: 'pong', pong: myPingChallange }));
    }

    if (data.type === 'broadcast') {
        console.log("broadcast received: " + JSON.stringify(data.players));

        data.players.forEach(playerObj => {
            if (!allPlayers.has(playerObj.id)) {
                const newPlayer = new Player(playerObj.id, null, playerObj.position.x, playerObj.position.y, playerObj.color);
                allPlayers.set(playerObj.id, newPlayer);
                console.log(`Added new player to allPlayers: ${playerObj.id}`);
            } else {
                const existingPlayer = allPlayers.get(playerObj.id);
                existingPlayer.position = playerObj.position;
                existingPlayer.alive = playerObj.alive;
                existingPlayer.hp = playerObj.hp;
                existingPlayer.latestMousePos = playerObj.latestMousePos;
                existingPlayer.latestMouseAngle = playerObj.latestMouseAngle;
                existingPlayer.fps = playerObj.fps;
                existingPlayer.currPlayerFrame = playerObj.currPlayerFrame;
            }
        });
    }

    if (data.type === 'playerDead') {
        console.log("player dead: " + data.playerId);
        mainScene.addChild(playerDeadSprite);
        //playerDead.drawAllFrames(ctx, allPlayers[data.playerId].position.x, allPlayers[data.playerId].position.y);
    }
};

// Render game loop
// capture the ctx framerate and display it on the screen

const bloodSpat = new Sprite({
    resource: resources.images.hitsplat,
    frameSize: { width: 64, height: 64 },
    hFrames: 10, vFrames: 1,
    position: new Vector(0, 0),
    frame: 0,
    scale: 1, rotationDeg: 0
});

const update = (delta) => {
    mainScene.stepEntry(delta, mainScene);
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
    mainScene.draw(gameCtx, 0, 0);
    Array.from(allPlayers.values()).forEach(_player => {
        if (_player === undefined) return;
        if (_player.alive === false) return;
        // console.log("drawing player: " + _player.id + " " + _player.position.x + " , " + _player.position.y);
        //console.log(">>>> test" + " " + _player.id + " " + _player.position.x + " , " + _player.position.y);
        walkingLegsSprite.frame = _player.currPlayerFrame;
        walkingLegsSprite.step(deltaTime);
        walkingLegsSprite.offsetX = _player.position.x;
        walkingLegsSprite.offsetY = _player.position.y;
        walkingLegsSprite.rotationDeg = (_player.latestMouseAngle + 90) % 360;
        _player.addChild(walkingLegsSprite);
        _player.draw(gameCtx, _player.position.x, _player.position.y);
    });
    //console.log("delta frame time ms: " + deltaTime);

    uiCtx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
    const myHud = new HUDOverlay({ position: new Vector(0, uiCanvas.height - 100), myPlayerObj: allPlayers.get(myPlayerId), color: 'red', frameTimeMs: deltaTime, mainSceneObj: mainScene });
    myHud.draw(uiCtx, 0, uiCanvas.height - 100);

}

let gameLoop = new GameLoop(update, draw);
gameLoop.start();
