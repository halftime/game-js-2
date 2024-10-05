import  Player from './player.js';
// import WebSocket from 'ws';
import { WebSocketServer } from 'ws';



// create new websocket server
// ts WebSocketServer
const wss = new WebSocketServer({port: 3000}); //WebSocket.Server({ port: 3000 });


// player object class holding player id, hitpoints, positions, color, ping

// Store all connected players
let players = {};

wss.on('connection', (ws) => {
    const randomPlayerId = Math.round(Math.random() * 999999);

    ws.id = randomPlayerId; // assign player id to ws object
    const newPlayer = new Player(randomPlayerId, ws);

    
    players[newPlayer.id] = newPlayer;

    console.log("new player connected: " + newPlayer.id);

    ws.send(JSON.stringify({ type: 'playerid', playerId: newPlayer.id }));
    ws.send(JSON.stringify({ type: 'updatePlayers', players }));

    // Handle incoming messages from the client
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        //console.log("received ws: " + data);

        if (data.type === "keydown")
        {
            console.log("keydown received from client: " + data.playerid + " key: " + data.keyevent);
            players[data.playerid].updatePosition(data.keyevent);
            // Send updated position to the server
            broadcastPlayers();
        }

        if (data.type === "pong") {
            console.log("pong received from client");
            let pongChallange = new PingChallange(data.pong.challangeId, data.pong.initTimestamp, data.pong.pongTimestamp);
            console.log("pong received challange:: " + pongChallange.challangeId + " ping ms: " + pongChallange.calculatePing());
        }

        // if (data.type === 'move') {
        //     // Update player position
        //     players[newPlayer.id] = { ...players[newPlayer.id], ...data.position };

        //     // Broadcast updated player data to all clients
        //     broadcastPlayers();
        // }

        if (data.type === "click") {
            console.log("click received from client at x: " + data.x + " y: " + data.y);
        }

       
    });

    // Remove the player when they disconnect
    ws.on('close', () => {
        console.log("player disconnected: " + ws.id);
        delete players[ws.id];
        broadcastPlayers();
    });

    // Function to send updated players list to all clients
    function broadcastPlayers() {
        const data = JSON.stringify({ type: 'updatePlayers', players });
        Object.keys(players).forEach(playerId => {
            players[playerId].webSocket.send(data);
        });

        // wss.clients.forEach(client => {
        //     if (client.readyState === WebSocket.OPEN) {
        //         client.send(data);
        //     }
        // });
    }
});

// setInterval(() => {
//     let myPingChallange = new PingChallange(challangeId = Math.round(Math.random() * 99999999), initTimestamp = Date.now());
//     ws.send(JSON.stringify({type: 'ping', ping: myPingChallange}));
//     console.log("sent " + JSON.stringify(myPingChallange));
// }, 10000);

console.log('Server is running on ws://localhost:3000');