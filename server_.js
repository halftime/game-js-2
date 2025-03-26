import Player from './player.js';
import { WebSocketServer } from 'ws';
import { myServerResource } from './server-resource.js';
// import { heartOKSprite, walkingLegsSprite, backgroundSprite, playerDeadSprite } from './sprites.js';

const wss = new WebSocketServer({ port: myServerResource.serverPort });
console.log("server port: " + myServerResource.serverPort);
let activePlayers = new Map();

wss.on('connection', (ws) => {
    const randomPlayerId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    ws.id = randomPlayerId; // assign player id to ws object
    let newPlayer = new Player(randomPlayerId, ws, 200, 200, Player.getRandomColor());
    activePlayers.set(randomPlayerId, newPlayer);
    console.log("new player connected: " + newPlayer.id);
    ws.send(JSON.stringify({ type: 'newplayer', playerObj: newPlayer }));


    // Handle incoming messages from the client
    ws.on('message', (message) => {
        const timestampOnReceive = Date.now();
        const data = JSON.parse(message);

        if (!activePlayers.has(data.playerid)) return;

        const currPlayer = activePlayers.get(data.playerid);
        console.log("current player: " + JSON.stringify(currPlayer));
        console.log("received message from client: " + data.type + " playerid: " + data.playerid);
        switch (data.type) {
            case "keydown":
                currPlayer.latestKeyTimeMs = timestampOnReceive;
                const netPosChange = myServerResource.netPosChangeFromKeyEvent(data.keyevent);
                const suggestedPosition = myServerResource.moveFromPosition(currPlayer.position, netPosChange);
                if (!myServerResource.isCoordinateObstructed(suggestedPosition.x, suggestedPosition.y)) {
                    currPlayer.position = suggestedPosition;
                }
                return;

            case "click":
                currPlayer.latestClickTimeMs = timestampOnReceive;
                console.log(`mouseclick received from client ${data.playerid} at x: ${data.mousePos.x} y: ${data.mousePos.y}`);
                currPlayer.takeDamage(20); // testing damage, death
                return;

            case "mousemove":

                currPlayer.latestMouseMoveTimeMs = timestampOnReceive;
                currPlayer.latestMouseAngle = data.latestMouseAngle;
                currPlayer.latestMousePos = data.latestMousePos;
                return;

            case "pong":
                console.log("pong received from client");
                const pongChallange = new PingChallange(data.pong.challangeId, data.pong.initTimestamp, data.pong.pongTimestamp);
                console.log("pong received challange:: " + pongChallange.challangeId + " ping ms: " + pongChallange.calculatePing());
                return;

            default:
                console.error(`Unknown data type: ${data.type}`);
                return;
        }
    });

    // Remove the player when they disconnect
    ws.on('close', () => {
        console.log("player disconnected: " + ws.id);
        activePlayers.delete(ws.id);
        //console.log("active players: " + Object.keys(activePlayers).length);
        //broadcastPlayers();
    });
});

// Function to send updated players list to all clients



// use setinterval to calculate server 60 hz tickrate and update clients framecount 


function broadcastPlayers() { // hardwire broadcast to server tick interval? 
    const newFrameTime = Date.now();
    const data = JSON.stringify({ type: 'broadcast', players: Array.from(activePlayers.values()) });

    activePlayers.forEach((currentPlayer, playerId) => {
        if (currentPlayer.hp <= 0) {
            currentPlayer.alive = false;
            //console.log(">>> testing player dead", currentPlayer.id);
            // broadcast dead player
            // dead client needs to be forced to respawn
        }
        currentPlayer.websocket.send(data);
    });


    // console.log("broadcasting; " + data);
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

    // show tick rate every 5 seconds
    if (serverTickCounter % 300 === 0) {
        const avgtickrate = serverTickCounter / (performance.now() - initialTime) * 1000;
        console.log("Server tickcount: " + serverTickCounter + " avg tickrate: " + avgtickrate);
    }

    const waitTime = timeToNextTick < 0 ? 0 : timeToNextTick;
    nextTickTime += targetInterval;
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