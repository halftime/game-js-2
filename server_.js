import Player from './player.js';
// import WebSocket from 'ws';
import { WebSocketServer } from 'ws';
import { serverResource } from './server-resource.js';
import { heartOKSprite, walkingLegsSprite, backgroundSprite, playerDeadSprite } from './sprites.js';



const wss = new WebSocketServer({ port: 3000 }); //WebSocket.Server({ port: 3000 });
let players = {};

wss.on('connection', (ws) => {
    const randomPlayerId = Math.round(Math.random() * 999999);
    ws.id = randomPlayerId; // assign player id to ws object
    let newPlayer = new Player(randomPlayerId, ws, 200, 200, Player.getRandomColor());
    players[newPlayer.id] = newPlayer;
    console.log("new player connected: " + newPlayer.id);
    ws.send(JSON.stringify({ type: 'newPlayer', playerObj: newPlayer }));
    //broadcastPlayers();

    // Handle incoming messages from the client
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        //if (data.playerid === undefined) return;
        if (data.type === "keydown") {
            if (players[data.playerid] === undefined) return;  
            console.log("keydown received from client: " + data.playerid + " key: " + data.keyevent);
            if (players[data.playerid].updatePosition(data.keyevent)) {
                console.log(">>> player position: " + players[data.playerid].position.x + " , " + players[data.playerid].position.y);
            }
            return;
        }

        if (data.type === "pong") {
            console.log("pong received from client");
            let pongChallange = new PingChallange(data.pong.challangeId, data.pong.initTimestamp, data.pong.pongTimestamp);
            console.log("pong received challange:: " + pongChallange.challangeId + " ping ms: " + pongChallange.calculatePing());
            return;
        }

        if (data.type === "click") {
            console.log("click received from client at x: " + data.x + " y: " + data.y);
            return;
        }
    });

    // Remove the player when they disconnect
    ws.on('close', () => {
        console.log("player disconnected: " + ws.id);
        delete players[ws.id];
        //broadcastPlayers();
    });

    // Function to send updated players list to all clients

});

// use setinterval to calculate server 60 hz tickrate and update clients framecount 


function broadcastPlayers() { // hardwire broadcast to server tick interval? 
    const newFrameTime = Date.now();
    const data = JSON.stringify({ type: 'updatePlayers', players });

    Object.keys(players).forEach(playerId => {
        let currentPlayer = players[playerId];
        if (currentPlayer.hp <= 0) {
            players[playerId].alive = false;
        }else
        {
            walkingLegsSprite.step(16);
            players[playerId].addChild(walkingLegsSprite);
        }
        
    });

    Object.keys(players).forEach(playerId => {
       // console.log("broadcasting player data to player: " + players[playerId].id);
        players[playerId].websocket.send(data);
    });
}


const targetInterval = 1000 / 60; // 60 ticks per second
const initialTime = performance.now();
let serverTickCounter = 0;
let nextTickTime = initialTime + targetInterval;

function ServerTickLoop() {
    const currentTime = performance.now();
    serverTickCounter += 1;

    // Do server tick logic here
    Object.keys(players).forEach(playerId => {
        players[playerId].currPlayerFrame += 1;
        console.log("player to json: " + JSON.stringify(players[playerId]));
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

console.log('Server is running on ws://localhost:3000');

ServerTickLoop();