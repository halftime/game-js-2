import { Vector } from "./grid.js";
import fs from 'fs';


const wallsXgenStudioMap = JSON.parse(fs.readFileSync('./map/not_walkables.json', 'utf-8'));

class ServerResource {
    serverPort = 5501;
    constructor() {
        this.wallSquares = [];
        for (let i = 0; i < wallsXgenStudioMap.length; i++) {
            const wall = wallsXgenStudioMap.at(i);
            this.wallSquares.push([new Vector(wall[0], wall[1]),
            new Vector(wall[2], wall[3])]); // [top left, bottom right]
        }

        this.obstructedMap = this.generateCoordinateMap();
        console.log(">>> loaded walls: " + this.wallSquares.length);
        console.log(">>> collision map coordinates: " + this.obstructedMap.size);
    }

    netPosChangeFromKeyEvent(keyEvent)
    {
        let netPosition = new Vector(0, 0); // copy current player position
        let movingDistance = 10;
       // if (keyEvent === 'Enter' || keyEvent === "Space") this.takeDamage(20);
        if (keyEvent === 'ArrowUp') { netPosition.y -= movingDistance; }
        if (keyEvent === 'ArrowDown') { netPosition.y += movingDistance; }
        if (keyEvent === 'ArrowLeft') { netPosition.x -= movingDistance; }
        if (keyEvent === 'ArrowRight') { netPosition.x += movingDistance; }

       // console.log(">>> player position: " + netPosition.x + " , " + netPosition.y);
        return netPosition;
    }

    moveFromPosition(currentPosition, netPosChange) {
        let proposedPosition = new Vector(currentPosition.x, currentPosition.y); 
        proposedPosition.x += netPosChange.x;
        proposedPosition.y += netPosChange.y;
        return proposedPosition
    }

    isCoordinateObstructed(x, y) {
        return this.obstructedMap.get(`${x},${y}`) || false;
    }

    isWallCollision(position) { // bruteforce wall collision detection, only used for hashmap generation
        for (let i = 0; i < this.wallSquares.length; i++) {
            const wall = this.wallSquares[i];
            if (position.x >= Math.min(wall[0].x, wall[1].x) && position.x <= Math.max(wall[0].x, wall[1].x) &&
                position.y >= Math.min(wall[0].y, wall[1].y) && position.y <= Math.max(wall[0].y, wall[1].y)) {
                return true;
            }
        }
        return false;
    }

    generateCoordinateMap() {
        const mymap = new Map();
        for (let x = 0; x < 1151; x++) {
            for (let y = 0; y < 791; y++) {
                if (this.isWallCollision(new Vector(x, y))) // only add obstructed coordinates to map
                {
                    mymap.set(`${x},${y}`, true); // true = obstructed, used for collision detection
                }
            }
        }
        return mymap;
    }
}

const myServerResource = new ServerResource();
export { myServerResource };