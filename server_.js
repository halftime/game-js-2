import Player from './player.js';
import { WebSocketServer } from 'ws';
import { myServerResource } from './server-resource.js';
import { heartOKSprite, walkingLegsSprite, backgroundSprite, playerDeadSprite } from './sprites.js';

const wss = new WebSocketServer({ port: myServerResource.serverPort });
console.log("server port: " + myServerResource.serverPort);
let activePlayers = new Map();

wss.on('connection', (ws) => {
    const randomPlayerId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    ws.id = randomPlayerId; // assign player id to ws object

    let newPlayer = new Player(randomPlayerId, ws, 200, 200, Player.getRandomColor());
    activePlayers[newPlayer.id] = newPlayer;
    console.log("new player connected: " + newPlayer.id);
    ws.send(JSON.stringify({ type: 'newPlayer', playerObj: newPlayer }));
    //broadcastPlayers();

    // Handle incoming messages from the client
    ws.on('message', (message) => {
        const timestampOnReceive = Date.now();
        const data = JSON.parse(message);


        //if (data.playerid === undefined) return;
        if (data.type === "keydown") {
            if (activePlayers[data.playerid] === undefined) return;
            activePlayers[data.playerid].latestKeyTimeMs = timestampOnReceive;

            const netPosChange = myServerResource.netPosChangeFromKeyEvent(data.keyevent);
            const suggestedPosition = myServerResource.moveFromPosition(activePlayers[data.playerid].position, netPosChange);
            if (!myServerResource.isCoordinateObstructed(suggestedPosition.x, suggestedPosition.y)) {
                activePlayers[data.playerid].position = suggestedPosition;
            }
            
        }

        if (data.type === "pong") {
            console.log("pong received from client");
            let pongChallange = new PingChallange(data.pong.challangeId, data.pong.initTimestamp, data.pong.pongTimestamp);
            console.log("pong received challange:: " + pongChallange.challangeId + " ping ms: " + pongChallange.calculatePing());
            return;
        }

        if (data.type === "mouseclick") {
            if (activePlayers[data.playerId] === undefined) return;
            activePlayers[data.playerId].latestClickTimeMs = timestampOnReceive;
            console.log(`mouseclick received from client ${data.playerId} at x: ${data.mousePos.x} y: ${data.mousePos.y}`);
            return;
        }

        if (data.type === "mousemove") {
            if (activePlayers[data.playerId] === undefined) return;
            activePlayers[data.playerId].latestMouseMoveTimeMs = timestampOnReceive;
            activePlayers[data.playerId].latestMouseAngle = data.latestMouseAngle;
            activePlayers[data.playerId].latestMousePos = data.latestMousePos;
            //console.log(`mousemove received from client ${data.playerId} at x: ${data.latestMousePos.x} y: ${data.latestMousePos.y} angle: ${data.latestMouseAngle}`);
            return;
        }
    });

    // Remove the player when they disconnect
    ws.on('close', () => {
        console.log("player disconnected: " + ws.id);
        delete activePlayers[ws.id];
        console.log("active players: " + Object.keys(activePlayers).length);
        //broadcastPlayers();
    });

    // Function to send updated players list to all clients

});

// use setinterval to calculate server 60 hz tickrate and update clients framecount 


function broadcastPlayers() { // hardwire broadcast to server tick interval? 
    const newFrameTime = Date.now();
    const data = JSON.stringify({ type: 'broadcast', players: activePlayers });

    Object.keys(activePlayers).forEach(playerId => {
        let currentPlayer = activePlayers[playerId];
        if (currentPlayer.hp <= 0) 
            {
            activePlayers[playerId].alive = false;
            // broadcast dead player
            // dead client needs to be forced to respawn
        } 

    });

    Object.keys(activePlayers).forEach(playerId => {
        // console.log("broadcasting player data to player: " + players[playerId].id);
        activePlayers[playerId].websocket.send(data);
    });

    console.log("broadcasting player data; " + data);
}


const targetInterval = 1000 / 60; // 60 ticks per second
const initialTime = performance.now();
let serverTickCounter = 0;
let nextTickTime = initialTime + targetInterval;

function ServerTickLoop() {
    const currentTime = performance.now();
    serverTickCounter += 1;

    // Do server tick logic here
    Object.keys(activePlayers).forEach(playerId => {
        // should the server set the frame or the client?
        //players[playerId].currPlayerFrame += 1;


        //console.log("player to json: " + JSON.stringify(players[playerId]));
    });
    broadcastPlayers();

    // Calculate the time we should wait until the next tick
    const timeToNextTick = nextTickTime - currentTime;

    // Log tick rate every second (60 ticks)
    if (serverTickCounter % 300 === 0) {
        const avgtickrate = serverTickCounter / (performance.now() - initialTime) * 1000;
        console.log("Server tickcount: " + serverTickCounter + " avg tickrate: " + avgtickrate);
    }

    // Ensure we don't go negative on the interval
    const waitTime = timeToNextTick < 0 ? 0 : timeToNextTick;

    // Update next expected tick time
    nextTickTime += targetInterval;

    // Use setTimeout for the next tick
    setTimeout(ServerTickLoop, waitTime);
}

// Start the loop
ServerTickLoop();

// use setinterval to calculate server 60 hz tickrate and update clients framecount 

// setInterval(() => {
//     let myPingChallange = new PingChallange(challangeId = Math.round(Math.random() * 99999999), initTimestamp = Date.now());
//     ws.send(JSON.stringify({type: 'ping', ping: myPingChallange}));
//     console.log("sent " + JSON.stringify(myPingChallange));
// }, 10000);

console.log('Server is running');
ServerTickLoop();