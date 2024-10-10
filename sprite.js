import { Vector } from "./grid.js";
import { gameobject } from './GameObject.js';

export class Sprite extends gameobject{
    constructor({
        resource,
        frameSize,
        hFrames,
        vFrames,
        frame,
        position,
        scale,
        rotation,
        animationConfig,
    })
    {
        super({ });
        this.resource = resource; // image resource
        this.frameSize = frameSize; // sprite frame size
        this.hFrames = hFrames ?? 1; // sprite horizontal frames
        this.vFrames = vFrames ?? 1;
        this.frame = frame;
        this.frameMap = new Map();
        this.position = position ?? new Vector(0, 0);
        this.scale = scale ?? 1;
        this.rotation = rotation = 0;
        this.animations = animationConfig ?? null;
        this.buildFrameMap();
    }

    
    buildFrameMap()
    {
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

    step(deltaTime)
    {
        if (!this.animations) { return; }
        this.animations.step(deltaTime);
        this.frame = this.animations.frame;
    }

    drawImage(ctx, x, y)
    {
        if (!this.resource.loaded) { return; }

        let frameCoordX = 0;
        let frameCoordY = 0;

        const frame = this.frameMap.get(this.frame);

        if (frame)
        {
            frameCoordX = frame.x;
            frameCoordY = frame.y;
        }

        const frameSizeX = this.frameSize.width;
        const frameSizeY = this.frameSize.height;

        ctx.drawImage(
            this.resource.image,
            frameCoordX, frameCoordY, // crop sprite
            frameSizeX, frameSizeY,
            x + this.position.x, y + this.position.y, // position adjusted by sprite position
            frameSizeX * this.scale, 
            frameSizeY * this.scale
        );
        // ctx.save();
        // ctx.translate(this.position.x, this.position.y);

    }
}