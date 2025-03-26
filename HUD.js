import { HEARTBEATOKFRAMES } from "./animations.js";
import { gameobject } from "./GameObject.js";
import { heartOKSprite, heartCriticalSprite, heartImpactedSprite } from "./sprites.js";

export class HUDOverlay extends gameobject {
    constructor({ position, myPlayerObj, color, frameTimeMs, mainSceneObj }) {
        super({ position, uniqudId: 'HUDOverlay' });
        this.frameTimeMs = frameTimeMs ?? 1;
        this.color = color;
        this.myPlayerObj = myPlayerObj ?? undefined;
        this.pingMs = 0;
        this.fps = Math.round(1000 / this.frameTimeMs);
        //this.position = position;
        this.counter = 0;
        this.mainSceneObj = mainSceneObj ?? undefined;
    }

    startDeathAnimation(uiCtx) {
        let opacity = 1.0;
        console.log("startDeathAnimation");
        const deathAnimation = () => {
            // Clear UI canvas before drawing new frame
            uiCtx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);

            // Draw fading "death screen"
            uiCtx.fillStyle = `rgba(255, 0, 0, ${opacity})`; // Red screen with decreasing opacity
            uiCtx.fillRect(0, 0, uiCanvas.width, uiCanvas.height);

            uiCtx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            uiCtx.font = '50px Arial';
            uiCtx.fillText('Sit down', uiCanvas.width * 4/6, uiCanvas.height * 4/6);
            uiCtx.fillText('You are dead', uiCanvas.width * 1/4, uiCanvas.height * 1/6);
            uiCtx.fillText('Get rekt', uiCanvas.width * 3/4, uiCanvas.height * 2/6);
            uiCtx.fillText('rip in pizza', uiCanvas.width * 1/6, uiCanvas.height * 3/6);
            uiCtx.fillText('Git gud', uiCanvas.width * 2/6, uiCanvas.height * 5/6);
        };

       deathAnimation();
    }



    draw(ctx, x, y) {
        if (this.myPlayerObj === undefined) { return; }
        this.counter++;

        ctx.clearRect(0, 0, 200, 200);
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.font = '20px Aria';
        // ctx.fillRect(x, y, this.width, this.height);
        ctx.fillText(`HP: ${this.myPlayerObj.hp}`, 0, this.position.y);

        ctx.fillStyle = 'red';
        ctx.fillRect(5, 5, 200, 20);

        ctx.fillStyle = 'green';
        ctx.fillRect(5, 5, this.myPlayerObj.hp / 100 * 200, 20);

        ctx.fillStyle = this.color;
        ctx.fillText(`Ping: ${this.pingMs} ms`, 0, this.position.y + 15);
        ctx.fillText(`FPS: ${this.fps}`, 0, this.position.y + 30);
        this.myPlayerObj.fps = this.fps;
        ctx.fillText(`Position: ${this.myPlayerObj.position.x} , ${this.myPlayerObj.position.y}`, 0, this.position.y + 45);
        ctx.fillText(`Mouse pos: ${this.myPlayerObj.latestMousePos.x} , ${this.myPlayerObj.latestMousePos.y}`, 0, this.position.y + 60);
        ctx.fillText(`Mouse angle: ${this.myPlayerObj.latestMouseAngle}°`, 0, this.position.y + 75);
        ctx.restore();

        if (this.myPlayerObj.hp <= 0) 
        {
            this.startDeathAnimation(ctx);
        }

        //ctx.translate(0, 0); 
        if (this.myPlayerObj.hp >= 75) 
        {
          this.mainSceneObj.addChild(heartOKSprite);
          this.mainSceneObj.removechild(heartCriticalSprite);
          this.mainSceneObj.removechild(heartImpactedSprite);
            heartOKSprite.draw(ctx, 0, 0);
            return;
        }

        if (this.myPlayerObj.hp < 75 && this.myPlayerObj.hp > 25) 
        {
            this.mainSceneObj.addChild(heartImpactedSprite);
            this.mainSceneObj.removechild(heartOKSprite);
            this.mainSceneObj.removechild(heartCriticalSprite);
            heartImpactedSprite.draw(ctx, 0, 0);
            return;
        }
        if (this.myPlayerObj.hp <= 25 && this.myPlayerObj.hp > 0) 
        {
            this.mainSceneObj.addChild(heartCriticalSprite);
            this.mainSceneObj.removechild(heartOKSprite);
            this.mainSceneObj.removechild(heartImpactedSprite);
            heartCriticalSprite.draw(ctx, 0, 0);
            return;
        }
    }
}