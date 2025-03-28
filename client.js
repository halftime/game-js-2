import Player from './player.js';
import { resources } from './resource.js';
import { Sprite } from './sprite.js';
import { Vector } from "./grid.js";
import { GameLoop } from './gameloop.js';
import { FrameIndexPattern } from './FrameIndexPattern.js';
import { DEADFRAMES, HEARTBEATOKFRAMES } from './animations.js';
import { gameobject } from './GameObject.js';
import { heartOKSprite, heartCriticalSprite, heartImpactedSprite, walkingLegsSprite, backgroundSprite, playerDeadSprite, bloodSpat } from './sprites.js';
import { HUDOverlay } from './HUD.js';
import { clientJoinReq } from './clientJoinReq.js';
import { Camera } from './camera.js';
import { playerMouseClicked, playerMouseMoved } from './clientMouseData.js';

const serverPort = 5501;
const serverUrl = `ws://localhost:${serverPort}`;

const radToDeg = 180 / Math.PI;

const gameCanvas = document.getElementById('gameCanvas');
const uiCanvas = document.getElementById('uiCanvas');

const gameCtx = gameCanvas.getContext('2d');
const uiCtx = uiCanvas.getContext('2d');

gameCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
uiCtx.scale(window.devicePixelRatio, window.devicePixelRatio);

function getMousePos(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}



let allPlayers = new Map();
let myPlayerId = 0;

let mainScene = new gameobject({ position: new Vector(0, 0), id: 'mainscene' });
mainScene.addChild(backgroundSprite);
let uiScene = new gameobject({ position: new Vector(0, 0), id: 'uiscene' });

//uiScene.addChild(myHud);

// Establish a connection to the server
console.log("connecting to server: " + serverUrl);
const socket = new WebSocket(serverUrl);

socket.onopen = () => {
    console.log("connected to server");
    const myClientJoinReq = new clientJoinReq("testuser");
    console.log("sending join request: " + JSON.stringify(myClientJoinReq));
    socket.send(JSON.stringify(myClientJoinReq));
};


['click', 'mousemove', 'keydown'].forEach(eventType => {
    document.addEventListener(eventType, (event) => {

        if (myPlayerId === 0 || !myPlayerId) return;
        const mousePos = getMousePos(gameCanvas, event);

        if (eventType === "mousemove") {
            if (!allPlayers.has(myPlayerId)) return;
            //console.log("mouse pos: " + JSON.stringify(mousePos));
            const myPlayerPositon = allPlayers.get(myPlayerId).position ?? new Vector(0, 0);
            const myMouseMoved = new playerMouseMoved(myPlayerId, mousePos, myPlayerPositon);
            socket.send(JSON.stringify(myMouseMoved));
            return;
        }
        if (eventType === "click") {
            if (!allPlayers.has(myPlayerId)) return;
            const myPlayerPositon = allPlayers.get(myPlayerId).position ?? new Vector(0, 0);
            console.log("DEBUG: mouse clicked at: " + JSON.stringify(mousePos));
            const myMouseClicked = new playerMouseClicked(myPlayerId, mousePos, myPlayerPositon);
            socket.send(JSON.stringify(myMouseClicked));
            return;
        }

        if (eventType === "keydown") {
            console.log("key pressed: " + event.key);
            socket.send(JSON.stringify({ type: 'keydown', keyevent: event.key, playerid: myPlayerId }));
            return;
        }
    });
});

socket.onmessage = (message) => {
    const data = JSON.parse(message.data);
    if (data.type === 'newplayer') {
        console.log("my player object added: " + JSON.stringify(data.playerObj));
        myPlayerId = data.playerObj.id;

        const myPlayerObj = new Player(data.playerObj.id, null, data.playerObj.position.x, data.playerObj.position.y, data.playerObj.color, data.playerObj.username);

        allPlayers.set(data.playerObj.id, myPlayerObj);
        console.log(">>> my player id: " + myPlayerId);
        console.log("allPlayers: " + JSON.stringify(Array.from(allPlayers.values())));
        return;
    }

    if (data.type === 'ping') { // server sends ping challange, client responds with pong
        console.log("received ws ping: " + data.ping.challangeId);
        let myPingChallange = new PingChallange(data.ping.challangeId, data.ping.initTimestamp, Date.now());
        socket.send(JSON.stringify({ type: 'pong', pong: myPingChallange }));
    }

    if (data.type === 'broadcast') {
        //console.log("broadcast received: " + JSON.stringify(data.players));

        Array.from(data.players).forEach(playerObj => {
            if (!allPlayers.has(playerObj.id)) {
                let newPlayer = new Player(playerObj.id, null, playerObj.position.x, playerObj.position.y, playerObj.color);
                allPlayers.set(playerObj.id, newPlayer);

            } else {
                allPlayers.get(playerObj.id).position.x = playerObj.position.x;
                allPlayers.get(playerObj.id).position.y = playerObj.position.y;
                allPlayers.get(playerObj.id).alive = playerObj.alive;
                allPlayers.get(playerObj.id).hp = playerObj.hp;
            }

            if (allPlayers.has(playerObj.id)) {
                mainScene.addChild(allPlayers.get(playerObj.id));
            }

        });
    }

    if (data.type === 'playerDead') {
        console.log("player dead: " + data.playerId);
        //mainScene.addChild(playerDeadSprite);
        //playerDead.drawAllFrames(ctx, allPlayers[data.playerId].position.x, allPlayers[data.playerId].position.y);
    }
};

// Render game loop
// capture the ctx framerate and display it on the screen

const update = (delta) => {
    mainScene.stepEntry(delta, mainScene);
    uiScene.stepEntry(delta, uiScene);
}


// const heroPlayer = new Player({ position: new Vector(100, 100), color: 'blue' });
// mainScene.addChild(heroPlayer);




// myHud.drawImage(ctx, 0, canvas.height - 100);

function getmyPlayerOrNull() {
    if (allPlayers.has(myPlayerId)) {
        return allPlayers.get(myPlayerId);
    }
    return undefined;
}

let lastFrameTime = performance.now();
const draw = () => {
    let myPlayer = getmyPlayerOrNull();
    if (!myPlayer) return;
    const currentTime = performance.now();
    const deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;

    // Clear the game canvas and save the context
    gameCtx.clearRect(0, 0, 2000, 2000);
    gameCtx.save();

    gameCtx.translate(gameCanvas.width / 2, gameCanvas.height / 2);
    gameCtx.translate(-myPlayer.position.x, -myPlayer.position.y);

    mainScene.draw(gameCtx, 0, 0);
    gameCtx.restore();

    uiCtx.clearRect(0, 0, 2000, 2000);

    let myHud = new HUDOverlay({ position: myPlayer.position, color: 'red', frameTimeMs: deltaTime, hitPoints: myPlayer.hp });
    myHud.drawHudTexts(uiCtx);

    uiScene.removeChild(heartOKSprite);
    uiScene.removeChild(heartCriticalSprite);
    uiScene.removeChild(heartImpactedSprite);

    if (myPlayer.hp == 100) {
        uiScene.addChild(heartOKSprite);
    }
    else if (myPlayer.hp < 100 && myPlayer.hp > 50) {
        uiScene.addChild(heartImpactedSprite);
    }
    else
    if (myPlayer.hp < 50) {
        uiScene.addChild(heartCriticalSprite);
    };

    uiScene.draw(uiCtx, 0, 0);
};

let gameLoop = new GameLoop(update, draw);
gameLoop.start();
