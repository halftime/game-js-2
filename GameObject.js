import { Vector } from "./grid.js";

export class gameobject {
    constructor({ position, id }) {
        this.id = id ?? Math.random().toString();
        this.position = position ?? new Vector(0, 0);
        this.children = new Map();
    }

    stepEntry(delta, root) {
        for (const child of this.children.values()) {
            // if (child === undefined) { return; }
            child.stepEntry(delta, root);
        }
        this.step(delta);
    }

    step(_delta) {
        for (const child of this.children.values()) {
            child.step(_delta);
        };
    }

    draw(ctx, x, y) {
        const drawPosX = this.position.x + x;
        const drawPosY = this.position.y + y;

        for (const child of this.children.values()) {
            // if (child === undefined) { return; }
            child.offsetX = -x;
            child.offsetY = -y;
            child.draw(ctx, drawPosX, drawPosY);
        };
        this.drawImage(ctx, drawPosX, drawPosY);
    }

    drawImage(ctx, drawPosX, drewPosY) { // override
    }
    addChild(gameObject) {
        if (this.children.has(gameObject.id)) {
            console.warn(`Child with id ${gameObject.id} already exists.`);
            return;
        }
        this.children.set(gameObject.id, gameObject);
        // console.log("added child: " + gameObject.id);
       // console.log("children: " + JSON.stringify(Array.from(this.children.values())));
    }

    removeChild(gameObject) {
        if (this.children.has(gameObject.id)) {
            this.children.delete(gameObject.id);
        }
    }
}