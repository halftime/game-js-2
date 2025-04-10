import { Vector } from "./grid.js";
import { gameobject } from './GameObject.js';

export class Sprite extends gameobject {
    constructor({
        resource, // image to draw
        frameSize, // cropsize
        hFrames, // sprite horizontal frames
        vFrames,
        frame, // frame to show
        position, // position to draw
        scale, // scale factor
        rotationDeg,
        animationConfig,
        id
    }) {
        super({ position, id: id });

        this.resource = resource; // image resource
        this.frameSize = frameSize; // sprite frame size
        this.hFrames = hFrames ?? 1; // sprite horizontal frames
        this.vFrames = vFrames ?? 1;
        this.frame = frame ?? 1;
        this.frameMap = new Map();
        this.position = position; //?? new Vector(0, 0);
        this.scale = scale ?? 1;
        this.rotationDeg = rotationDeg ?? 0; // sprite rotation angle in radians
        Object.defineProperty(this, 'animations', {
            value: animationConfig ?? null,
            enumerable: false,
            writable: true
        });
        this.buildFrameMap();
    }


    buildFrameMap() {
        let frameCount = 0;
        for (let v = 0; v < this.vFrames; v++) {
            for (let h = 0; h < this.hFrames; h++) {

                this.frameMap.set(frameCount,
                    new Vector(h * this.frameSize.width, v * this.frameSize.height),
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
        const centerX = x + this.position.x + (frameSizeX * this.scale) / 2;
        const centerY = y + this.position.y + (frameSizeY * this.scale) / 2; // Use this.position.y instead of this.position.x

        //console.log("drawing sprite: " + this.id + " at: " + centerX + " , " + centerY);

        // Move the origin to the center of the sprite for proper rotation
        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotationDeg % 360 * Math.PI / 180); // Convert to radians

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