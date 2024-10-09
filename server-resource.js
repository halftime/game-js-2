import { Vector } from "./grid.js";

const wallsXgenStudioMap = [
    [0, 0, 30, 760],
    [30, 296, 130, 362],

    [32, 0, 1116, 32],

    [164, 362, 426, 296],
    [460, 362, 622, 296],

    [30, 756, 1150, 786],
    [558, 690, 622, 756],
    [886, 362, 950, 754],
    [886, 98, 950, 294],

    [1116, 26, 1150, 756],

    [754, 0, 818, 262],
    [526, 196, 688, 262],
    [394, 30, 458, 262],

    [458, 196, 490, 262],
    [720, 196, 756, 262],

    [886, 32, 950, 66],

    [560, 356, 622, 622],
    [622, 428, 720, 492],
    [754, 428, 888, 492],

    [262, 30, 326, 96],
    [262, 132, 326, 228],
    [262, 264, 326, 298]
];

class ServerResource {
    constructor() {
        this.wallSquares = [];
        for (let i = 0; i < wallsXgenStudioMap.length; i++) {
            const wall = wallsXgenStudioMap.at(i);
            this.wallSquares.push([new Vector(wall[0], wall[1]),
            new Vector(wall[2], wall[3])]); // [top left, bottom right]

        }
        console.log("loaded walls: " + this.wallSquares.length);
    }

    isWallCollision(playerPos) {
        for (let i = 0; i < this.wallSquares.length; i++) {
            const wall = this.wallSquares[i];

            if (playerPos.x >= Math.min(wall[0].x, wall[1].x) && playerPos.x <= Math.max(wall[0].x, wall[1].x) &&
                playerPos.y >= Math.min(wall[0].y, wall[1].y) && playerPos.y <= Math.max(wall[0].y, wall[1].y)) {
                return true;
            }
        }
        
        return false;
    }
}

const serverResource = new ServerResource();
export { serverResource };