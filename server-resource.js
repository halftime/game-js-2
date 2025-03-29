import { Vector } from "./grid.js";
import fs from 'fs';

const spawnsXgenStudioMap = JSON.parse(fs.readFileSync('./json_configs/spawn_points.json', 'utf-8')); // (X, Y)
const wallsXgenStudioMap = JSON.parse(fs.readFileSync('./json_configs/not_walkables.json', 'utf-8')); // (X1, Y1, X2, Y2) - top left and bottom right coordinates of the wall
const weaponsXgenStudio = JSON.parse(fs.readFileSync('./json_configs/weapons.json', 'utf-8')); // see json
const killTextsXgenStudio = JSON.parse(fs.readFileSync('./json_configs/kill_texts.json', 'utf-8')); // see json

class ServerResource {
    serverPort = 5501;
    constructor() {
        this.wallSquares = [];
        this.spawns = [];

        this.weapons = {};
        this.killTexts = {};

        for (let i = 0; i < wallsXgenStudioMap.length; i++) {
            const wall = wallsXgenStudioMap.at(i);
            this.wallSquares.push([new Vector(wall[0], wall[1]), new Vector(wall[2], wall[3])]); // [top left, bottom right]
        }
        for (let i = 0; i < spawnsXgenStudioMap.length; i++) {
            const spawn = spawnsXgenStudioMap.at(i);
            this.spawns.push(new Vector(spawn[0], spawn[1]));
        }
        this.obstructedMap = this.generateCoordinateMap();
        console.log(">>> loaded walls: " + this.wallSquares.length);
        console.log(">>> collision map coordinates: " + this.obstructedMap.size);
        console.log(">>> loaded spawn points: " + this.spawns.length);

        for (let i = 0; i < weaponsXgenStudio.length; i++) {
            const weapon = weaponsXgenStudio.at(i);
            this.weapons[weapon.name] = weapon;
            console.log(">>> loaded weapon: " + weapon.name + " with damage: " + weapon.damage);
        }

        for (let i = 0; i < killTextsXgenStudio.length; i++) {
            const killText = killTextsXgenStudio.at(i);
            this.killTexts[killText.weapon] = killText;
            console.log(">>> loaded kill text: " + killText.weapon + " with text: " + killText.text);
        }
    }

    getRandomKillText(weaponName, killerName, victimName) {
        const killText = this.killTexts[weaponName];
        if (!killText) {
            return `${killerName} eliminated ${victimName} (no kill text for ${weaponName})`;
        }
        const kText = killText.text[Math.floor(Math.random() * killText.text.length)];
        const randomWeaponNameAlias = killText.weaponnames[Math.floor(Math.random() * killText.weaponnames.length)];
        return kText.replace("[Player Name]", killerName).replace("[Opponent Name]", victimName).replace("[Weapon Name]", randomWeaponNameAlias);
    }

    getSpawnPoint() {
       // return this.spawns[0]; //debugging, return random spawn point
        return this.spawns[Math.floor(Math.random() * this.spawns.length)];
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