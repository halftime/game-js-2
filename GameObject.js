import { Vector } from "./grid.js";

export class gameobject {
    constructor({ position, id }) {
        this.id = id ?? Math.random().toString();
        this.position = position ?? new Vector(0, 0);

        this.children = {}; // Change from Map to plain object

        console.log("gameobject created: " + JSON.stringify(this));
    }

    stepEntry(delta, root) {
        for (const childId in this.children) {
            this.children[childId].stepEntry(delta, root);
        }
        this.step(delta);
    }

    step(_delta) {
        for (const childId in this.children) {
            this.children[childId].step(_delta);
        }
    }

    draw(ctx, x, y) {
        const drawPosX = this.position.x + x;
        const drawPosY = this.position.y + y;

        for (const childId in this.children) {
            const child = this.children[childId];
            child.offsetX = -x;
            child.offsetY = -y;
            child.draw(ctx, drawPosX, drawPosY);
        }
        this.drawImage(ctx, drawPosX, drawPosY);
    }

    drawImage(ctx, drawPosX, drawPosY) { // override
    }

    addChild(gameObject) {
        if (this.children[gameObject.id]) {
            //console.warn(`Child with id ${gameObject.id} already exists.`);
            return;
        }
        this.children[gameObject.id] = gameObject;
    }

    removeChild(gameObject) {
        if (this.children[gameObject.id]) {
            delete this.children[gameObject.id];
        }
    }
}