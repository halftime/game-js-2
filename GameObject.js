import { Vector } from "./grid.js";

export class gameobject {
    constructor({ position }) {
        this.uniqueId = Math.random().toString(9);
        this.position = position ?? new Vector(0, 0);
        
        Object.defineProperty(this, 'children', {
            value: [],
            writable: true,  // You can modify it later
            enumerable: false // Exclude it from JSON.stringify
        });
    }

    stepEntry(delta, root) {
        this.children.forEach(child => {
            child.stepEntry(delta, root);
        });
        this.step(delta);
    }

    step(_delta) { // override
        this.children.forEach(c => {
            c.step(_delta);
        });
    }

    draw(ctx, x, y) {
        const drawPosX = x + this.position.x; //+ this.drawOffset.x
        const drawPosY = y + this.position.y; //+ this.drawOffset.y;
        this.drawImage(ctx, drawPosX, drawPosY);
        this.children.forEach(child => {
            child.draw(ctx, drawPosX, drawPosY);
        });
    }

    drawImage(ctx, drawPosX, drewPosY) { // override
    }

    addChild(gameObject) {
        if (this.children.filter(child => child.uniqueId === gameObject.uniqueId).length > 0) { return; }
        this.children.push(gameObject);
    }

    removechild(gameObject) {
        this.children = this.children.filter(child => child !== gameObject);
    }
}