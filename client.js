import Player from './player.js';
import { resources } from './resource.js';
import { Sprite } from './sprite.js';
import { Vector } from "./grid.js";
import { GameLoop } from './gameloop.js';
import { FrameIndexPattern } from './FrameIndexPattern.js';
import { DEADFRAMES, HEARTBEATOKFRAMES } from './animations.js';
import { gameobject } from './GameObject.js';
import { heartOKSprite, heartCriticalSprite, heartImpactedSprite, walkingLegsSprite, gameMapSprite, playerDeadSprite, bloodSpat, heartBeatSpriteslist } from './sprites.js';
import { HUDOverlay } from './HUD.js';
import { clientJoinReq } from './clientJoinReq.js';
import { Camera } from './camera.js';
import { playerMouseClicked, playerMouseMoved } from './clientMouseData.js';
import { myEvents } from "./events.js";


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
let uiScene = new gameobject({ position: new Vector(0, 0), id: 'uiscene' });

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
        if (getmyPlayerOrNull == null || getmyPlayerOrNull() == null) return;
        if (myPlayerId === 0 || !myPlayerId) return;
        const mousePos = getMousePos(gameCanvas, event);
        const myPlayerPositon = allPlayers.get(myPlayerId).position ?? new Vector(0, 0);

        switch (event.type) {
            case "mousemove":
                socket.send(JSON.stringify(new playerMouseMoved(myPlayerId, mousePos, myPlayerPositon)));
                break;
            case "click":
                socket.send(JSON.stringify(new playerMouseClicked(myPlayerId, mousePos, myPlayerPositon)));
                break;
            case "keydown":
                socket.send(JSON.stringify({ type: 'keydown', keyevent: event.key, playerid: myPlayerId }));
                break;
        }
    });
});

socket.onmessage = (message) => {
    const data = JSON.parse(message.data);
    switch (data.type) {
        case 'newplayer':
            console.log("my player object added: " + JSON.stringify(data.playerObj));
            myPlayerId = data.playerObj.id;

            const myPlayerObj = new Player(data.playerObj.id, null, data.playerObj.position.x, data.playerObj.position.y, data.playerObj.color, data.playerObj.username);

            allPlayers.set(data.playerObj.id, myPlayerObj);
            console.log(">>> my player id: " + myPlayerId);
            console.log("allPlayers: " + JSON.stringify(Array.from(allPlayers.values())));
            break;

        case 'ping': // server sends ping challenge, client responds with pong
            console.log("received ws ping: " + data.ping.challangeId);
            let myPingChallange = new PingChallange(data.ping.challangeId, data.ping.initTimestamp, Date.now());
            socket.send(JSON.stringify({ type: 'pong', pong: myPingChallange }));
            break;

        case 'broadcast':
            //console.log("broadcast received: " + JSON.stringify(data.players));

            Array.from(data.players).forEach(playerObj => {


                if (!allPlayers.has(playerObj.id)) {
                    let newPlayer = new Player(playerObj.id, null, playerObj.position.x, playerObj.position.y, playerObj.color);
                    allPlayers.set(playerObj.id, newPlayer);
                    mainScene.addChild(newPlayer);
                } else {
                    const existingPlayer = allPlayers.get(playerObj.id);
                    existingPlayer.position.x = playerObj.position.x;
                    existingPlayer.position.y = playerObj.position.y;
                    existingPlayer.alive = playerObj.alive;
                    existingPlayer.hp = playerObj.hp;

                    if (!mainScene.children[existingPlayer.id]) { mainScene.addChild(existingPlayer); }

                   if (playerObj.children["walkingLegsSprite"])
                   {
                        existingPlayer.addChild(walkingLegsSprite);
                        walkingLegsSprite.frame = playerObj.children["walkingLegsSprite"].frame; // set frame index FROM SERVER (tick)
                   }
                }
            });
            break;

        case 'servertime':
            console.log("server timestamp received: " + JSON.stringify(data));
            myEvents.emit("servertime", data.time);
            break;


        default:
            console.warn(`Unhandled message type: ${data.type}`);
            break;
    }
};

function getmyPlayerOrNull() {
    if (allPlayers.has(myPlayerId)) {
        return allPlayers.get(myPlayerId);
    }
    return undefined;
}

let xTranslation = 0;
let yTranslation = 0;

const update = (delta) => {
    mainScene.stepEntry(delta, mainScene);
    uiScene.stepEntry(delta, uiScene);

    let myPlayer = getmyPlayerOrNull();
    if (!myPlayer) return;
    xTranslation = Math.min(0, -myPlayer.position.x + gameCanvas.width / 2);
    yTranslation = Math.min(0, -myPlayer.position.y + gameCanvas.height / 2);
}

let lastFrameTime = performance.now();
const draw = () => {
    let myPlayer = getmyPlayerOrNull();
    if (!myPlayer) return;

    // Clear the game canvas and save the context
    gameCtx.clearRect(0, 0, 2000, 2000); gameCtx.save();
    gameCtx.translate(xTranslation, yTranslation);
    gameMapSprite.drawImage(gameCtx, 0, 0, 0, 0);
    mainScene.draw(gameCtx, 0, 0);

    //getmyPlayerOrNull().addChild(walkingLegsSprite);
    gameCtx.restore();

    // UI
    uiCtx.clearRect(0, 0, 2000, 2000); uiCtx.save();
    let myHud = new HUDOverlay({ position: myPlayer.position, color: 'red', frameTimeMs: performance.now() - lastFrameTime, hitPoints: myPlayer.hp });
    lastFrameTime = performance.now();

    myHud.drawHudTexts(uiCtx);

    heartBeatSpriteslist.forEach(hbs => { uiScene.removeChild(hbs); });

    if (myPlayer.hp == 100) {
        uiScene.addChild(heartOKSprite);
    }
    else if (myPlayer.hp <= 50) {
        uiScene.addChild(heartCriticalSprite);
    }
    else {
        uiScene.addChild(heartImpactedSprite);
    }

    uiScene.draw(uiCtx, 0, 0);
};

let gameLoop = new GameLoop(update, draw);
gameLoop.start();
