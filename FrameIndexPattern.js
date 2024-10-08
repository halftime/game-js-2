export class FrameIndexPattern{
    constructor(animationConfig){
        this.currentTime = 0;
        this.animationConfig = animationConfig;
        this.currentFrame = 0;
        this.duration = animationConfig.duration ?? 5000;
    }

    get frame(){
        const {frames} = this.animationConfig;
        for (let i = frames.length -1; i >= 0; i--){
            if (this.currentTime >= frames[i].time){
                return frames[i].frame;
            }
        }
        throw new Error("No frame found");
    }

    step(deltaTime){
        this.currentTime += deltaTime;
        if(this.currentTime >= this.duration){
            this.currentTime = 0;
            //this.currentFrame = (this.currentFrame) % this.animationConfig.frames.length;
        }
    }
}