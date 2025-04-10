import Player from './player.js';
import { WebSocketServer } from 'ws';
import { myServerResource } from './server-resource.js';
import { playerMouseMoved } from './clientMouseData.js';
import { walkingLegsSprite } from './sprites.js';
import { WeaponNames } from './weaponsEnum.js';

const targetInterval = myServerResource.targetServerTickTimeMs;
const wss = new WebSocketServer({ port: myServerResource.serverPort });
let activePlayers = new Map();

wss.on('connection', (ws) => {
    const randomPlayerId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    ws.id = randomPlayerId; // assign player id to ws object
    const newSpawnPoint = myServerResource.getSpawnPoint();

    // Handle incoming messages from the client
    ws.on('message', (message) => {
        const timestampOnReceive = Date.now();
        const data = JSON.parse(message);

        let currPlayer = null;
        switch (data.type) { // clientJoinReq
            case "join":
                console.log(">>> player requested to join: " + data.username);
                console.log(">>> " + JSON.stringify(data));

                const newPlayer = new Player(randomPlayerId, ws, newSpawnPoint.x, newSpawnPoint.y, Player.getRandomColor(), data.username);
                activePlayers.set(randomPlayerId, newPlayer);
                newPlayer.addChild(walkingLegsSprite); // add legs sprite to player object

                console.log("new player created: " + JSON.stringify(newPlayer));
                ws.send(JSON.stringify({ type: 'newplayer', playerObj: newPlayer }));
                return;

            case "keydown":
                if (!data.playerid) return;
                currPlayer = activePlayers.get(data.playerid);

                currPlayer.latestKeyTimeMs = timestampOnReceive;
                const netPosChange = myServerResource.netPosChangeFromKeyEvent(data.keyevent);
                const suggestedPosition = myServerResource.moveFromPosition(currPlayer.position, netPosChange);
                if (!myServerResource.isCoordinateObstructed(suggestedPosition.x, suggestedPosition.y)) {
                    currPlayer.position = suggestedPosition;
                }
                return;

            case "mouseclicked": // object from clientMouseData.js
                if (!data.playerid) return;
                currPlayer = activePlayers.get(data.playerid);

                console.log("mouseclicked received from client: " + JSON.stringify(data));

                currPlayer.latestClickTimeMs = timestampOnReceive;
                console.log(`mouseclick received from client ${data.playerid} at x: ${data.mousePos.x} y: ${data.mousePos.y}`);

                // debug test, remove later
                currPlayer.takeDamage(20); // testing damage, death

                const killTextTest = myServerResource.getRandomKillText(WeaponNames.AK47, "KILLER", "VICTIM");
                console.log(killTextTest);


                return;

            case "mousemoved":
                if (!data.playerid) return;
                let clientMouseMoved = new playerMouseMoved(data.playerid, data.mouseMovedPos, data.playerPos);
                //console.log("mousemoved received from client: " + JSON.stringify(clientMouseMoved));

                currPlayer = activePlayers.get(data.playerid);
                currPlayer.latestMouseMoveTimeMs = timestampOnReceive;
                // const dx = clientMouseMoved.mouseMovedPos.x - clientMouseMoved.playerPos.x;
                // const dy = clientMouseMoved.mouseMovedPos.y - clientMouseMoved.playerPos.y;
                // currPlayer.latestMouseAngle = Math.atan2(dy, dx) * (180 / Math.PI); // Convert radians to degrees
                currPlayer.latestMousePos = clientMouseMoved.mouseMovedPos;
                // currPlayer.latestMouseAngle = clientMouseMoved.calculateMouseAngle();
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
    });
});

// use setinterval to calculate server 60 hz tickrate and update clients framecount 

function broadcastPlayers() { // hardwire broadcast to server tick interval? 
    const newFrameTime = Date.now();
    const data = JSON.stringify({ type: 'broadcast', players: Array.from(activePlayers.values()) });

    activePlayers.values().forEach(p => {
        p.websocket.send(data);
    });

    //console.log("broadcasting players: " + data);
};



const initialTime = performance.now();
let serverTickCounter = 0;
let nextTickTime = initialTime + targetInterval;

function ServerTickLoop() {
    const currentTime = performance.now();
    serverTickCounter += 1;

    // Do server tick logic here
    broadcastPlayers(); // send player data to all clients

    const myTimeStamp = Date.now(); // ensure same timestamp to all clients
    activePlayers.forEach(player => {
        player.websocket.send(JSON.stringify({ type: 'servertime', time: myTimeStamp }));
    });

    // Calculate the time we should wait until the next tick
    const timeToNextTick = nextTickTime - currentTime;
    if ( serverTickCounter % 100 === 0) {
        // Calculate average tick rate
        const avgtickrate = serverTickCounter / (performance.now() - initialTime) * 1000;
        console.log(`Server tickcount: ${serverTickCounter} \t avg tick Ms: ${avgtickrate}`);
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