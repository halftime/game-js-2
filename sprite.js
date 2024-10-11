import { Vector } from "./grid.js";
import { gameobject } from './GameObject.js';

export class Sprite extends gameobject {
    constructor({
        resource,
        frameSize,
        hFrames,
        vFrames,
        frame,
        position,
        scale,
        rotationDeg,
        animationConfig,
    }) {
        super({});
        this.resource = resource; // image resource
        this.frameSize = frameSize; // sprite frame size
        this.hFrames = hFrames ?? 1; // sprite horizontal frames
        this.vFrames = vFrames ?? 1;
        this.frame = frame;
        this.frameMap = new Map();
        this.position = position ?? new Vector(0, 0);
        this.scale = scale ?? 1;
        this.rotationDeg = rotationDeg ?? 0; // sprite rotation angle in radians
        this.animations = animationConfig ?? null;
        this.buildFrameMap();
    }


    buildFrameMap() {
        let frameCount = 0;
        for (let i = 0; i < this.vFrames; i++) {
            for (let j = 0; j < this.hFrames; j++) {
                console.log("frame", i, j);
                this.frameMap.set(frameCount,
                    new Vector(j * this.frameSize.width, i * this.frameSize.height),
                );
                frameCount++;
            }
        }
    }

    step(deltaTime) {
        if (!this.animations) { return; }
        this.animations.step(deltaTime);
        this.frame = this.animations.frame;
    }

    drawImage(ctx, x, y) {
        if (!this.resource.loaded) { return; }

        let frameCoordX = 0;
        let frameCoordY = 0;

        const frame = this.frameMap.get(this.frame);

        if (frame) {
            frameCoordX = frame.x;
            frameCoordY = frame.y;
        }
        const frameSizeX = this.frameSize.width;
        const frameSizeY = this.frameSize.height;

        // Save the current context state
        ctx.save();

        // Calculate the center position of the sprite
        const centerX = x + this.position.x + (frameSizeX * this.scale) / 2 + this.offsetX;
        const centerY = y + this.position.y + (frameSizeY * this.scale) / 2 + this.offsetY; // Use this.position.y instead of this.position.x

        // Move the origin to the center of the sprite for proper rotation
        ctx.translate(centerX, centerY);

        // Normalize the rotation angle to avoid unexpected results
        const normalizedRotation = this.rotationDeg % 360; // Normalizing rotation
        ctx.rotate(normalizedRotation * Math.PI / 180); // Convert to radians

        // Draw the sprite centered at (0, 0)
        ctx.drawImage(
            this.resource.image,
            frameCoordX, frameCoordY, // Crop sprite
            frameSizeX, frameSizeY,    // Size of the cropped image
            - (frameSizeX * this.scale) / 2, // Centered x position relative to new origin
            - (frameSizeY * this.scale) / 2, // Centered y position relative to new origin
            frameSizeX * this.scale,    // Width scaled
            frameSizeY * this.scale       // Height scaled
        );

        // Restore the context to its original state
        ctx.restore();

    }
}