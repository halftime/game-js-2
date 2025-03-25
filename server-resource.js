import { Vector } from "./grid.js";

const wallsXgenStudioMap = [
    [0, 0, 30, 760],
    [952, 130, 1116, 196],
    [30, 296, 130, 362],
    [164, 362, 426, 296],
    [460, 362, 622, 296],
    [0, 756, 1150, 786],
    [558, 690, 622, 756],
    [886, 362, 950, 756],
    [886, 98, 950, 294],
    [1116, 26, 1150, 756],
    [754, 0, 818, 262],
    [526, 196, 688, 262],
    [394, 30, 458, 262],
    [458, 196, 490, 262],
    [720, 196, 756, 262],
    [886, 32, 950, 66],
    [32, 0, 1116, 32],
    [560, 356, 622, 622],
    [622, 428, 720, 492],
    [754, 428, 888, 492],
    [262, 30, 326, 96],
    [262, 132, 326, 228],
    [262, 264, 326, 298],
    [116, 110, 180, 216],
    [30, 460, 96, 588],
    [196, 482, 260, 634],
    [326, 482, 392, 634],
    [226, 362, 360, 426],
    [490, 460, 558, 592],
    [226, 690, 358, 756],
    [30, 688, 96, 756],
    [490, 690, 556, 756],
    [740, 660, 802, 704],
    [982, 460, 1006, 550],
    [950, 524, 1006, 550],

    [518, 72, 586, 122],
    [662, 68, 704, 136],

    [1100, 369, 1116, 390],
    [1100, 402, 1116, 452],
    [1100, 500, 1116, 616],

    [628, 492, 648, 508],
    [660, 492, 684, 504],

    [622, 532, 634, 582],
    [876, 536, 886, 586],

    [876, 666, 886, 714],
    [950, 562, 966, 586],
    [950, 600, 966, 680],

    [470, 362, 492, 370],
    [528, 362, 550, 380],
    [856, 492, 880, 512]
];

class ServerResource {
    serverPort = 5500;
    constructor() {
        this.wallSquares = [];
        for (let i = 0; i < wallsXgenStudioMap.length; i++) {
            const wall = wallsXgenStudioMap.at(i);
            this.wallSquares.push([new Vector(wall[0], wall[1]),
            new Vector(wall[2], wall[3])]); // [top left, bottom right]
        }

        this.validCoordinatesMap = this.generateCoordinateMap();
        console.log(">>> loaded walls: " + this.wallSquares.length);
        console.log(">>> collision map coordinates: " + this.validCoordinatesMap.size);
    }

    isCoordinateValid(x, y) {
        return this.validCoordinatesMap.get(`${x},${y}`) || false;
    }

    isWallCollision(position) {
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
                mymap.set(`${x},${y}`, !this.isWallCollision(new Vector(x, y)));
            }
        }
        return mymap;
    }
}

const myServerResource = new ServerResource();
export { myServerResource };