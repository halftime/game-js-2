import { gameobject } from "./GameObject.js";
import { heartOKSprite, heartCriticalSprite, heartImpactedSprite } from "./sprites.js";
import { Vector } from "./grid.js";

export class HUDOverlay extends gameobject {
    constructor({ position, myPlayerObj, color, frameTimeMs, mainSceneObj }) {
        super({ position, uniqudId: 'HUDOverlay' });
        this.frameTimeMs = frameTimeMs ?? 1;
        this.color = color;
        this.myPlayerObj = myPlayerObj ?? undefined;
        this.pingMs = 0;
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

            // Draw "You Died" text
            uiCtx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            uiCtx.font = '50px Arial';
            uiCtx.fillText('Sit down', uiCanvas.width * 4/6, uiCanvas.height * 4/6);
            uiCtx.fillText('You are dead', uiCanvas.width * 1/4, uiCanvas.height * 1/6);
            uiCtx.fillText('Get rekt', uiCanvas.width * 3/4, uiCanvas.height * 2/6);
            uiCtx.fillText('Got cooked?', uiCanvas.width * 1/6, uiCanvas.height * 3/6);
            uiCtx.fillText('Git gud', uiCanvas.width * 2/6, uiCanvas.height * 5/6);

            // Decrease opacity over time
           // opacity -= 0.02;

            // Stop animation when fully transparent

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

        //this.addChild(heartOKSprite);
        //heartOKSprite.frame = this.counter % 36;
       // heartOKSprite.draw(ctx, 50, 50);
        //ctx.drawImage(heartOKSprite.resource.image, 0, 0, 27, 27, 50, 50, 27, 27);

        ctx.fillStyle = this.color;
        ctx.fillText(`Ping: ${this.pingMs} ms`, 0, this.position.y + 15);
        ctx.fillText(`FPS: ${Math.round(1000 / this.frameTimeMs)}`, 0, this.position.y + 30);
        ctx.fillText('Position: ' + this.myPlayerObj.position.x + ', ' + this.myPlayerObj.position.y, 0, this.position.y + 45);
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

    // fps = 1 / (deltaTime / 1000); // from ms to seconds
    // ctx.fillStyle = 'red';
    // ctx.fillText(`FPS: ${Math.round(fps)}`, 0, 10);
    // ctx.fillText(`Players: ${Object.keys(allPlayers).length}`, 0, 30);
    // ctx.fillText(`Ping: ${pingMs} ms`, 0, 50);

    // if (allPlayers[myPlayerId] !== undefined) {
    //     ctx.fillText('HP: ' + allPlayers[myPlayerId].hp, 0, 70);
    //     ctx.fillText(`Player position x, y: ${allPlayers[myPlayerId].position.x ?? 0}, ${allPlayers[myPlayerId].position.y ?? 0}`, 0, 90);
    // }
    
}