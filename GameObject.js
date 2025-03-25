import { Vector } from "./grid.js";

export class gameobject {
    constructor({ position, stringId }) {
        this.uniqueId = stringId ?? Math.random().toString();
        this.position = position ?? new Vector(0, 0);
        //this.children = {};
        Object.defineProperty(this, 'children', {
            value: new Map(),
            writable: true,  // You can modify it later
            enumerable: true // false would Exclude it from JSON.stringify
        });
    }

    stepEntry(delta, root) {
        Object.keys(this.children).forEach(childId => {
            const child = this.children[childId];
            if (child === undefined) { return; }
            child.stepEntry(delta, root);
        });
        this.step(delta);
    }

    step(_delta) { // override
        Object.keys(this.children).forEach(childId => {
            this.children[childId].step(_delta);
        });
    }

    draw(ctx, x, y) {
        const drawPosX = this.position.x + x;
        const drawPosY = this.position.y + y;

        Object.keys(this.children).forEach(childId => {
            const child = this.children[childId];
            if (child === undefined) { return; }
            child.offsetX = -x;
            child.offsetY = -y;
            child.draw(ctx, drawPosX, drawPosY);
        });
        this.drawImage(ctx, drawPosX, drawPosY);
    }

    drawImage(ctx, drawPosX, drewPosY) { // override
    }

    addChild(gameObject) {
        if (this.children[gameObject.uniqueId]) { return; }
        this.children[gameObject.uniqueId] = gameObject;
    }

    removechild(gameObject) {
        if (this.children[gameObject.uniqueId]) {
            delete this.children[gameObject.uniqueId];
        }
    }
}