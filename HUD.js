import { HEARTBEATOKFRAMES } from "./animations.js";
import { gameobject } from "./GameObject.js";
import { heartOKSprite, heartCriticalSprite, heartImpactedSprite } from "./sprites.js";

export class HUDOverlay {
    constructor({ playerPosition, color, frameTimeMs, hitPoints }) {
        this.playerPosition = playerPosition;
        this.frameTimeMs = frameTimeMs ?? 1;
        this.hitPoints = hitPoints ?? 100;
        this.color = color;
        this.pingMs = 0;
        this.fps = Math.round(1000 / this.frameTimeMs);
        this.counter = 0;
    }

    startDeathAnimation(ctx) {
        let opacity = 1.0;
        console.log("startDeathAnimation");
        const deathAnimation = () => {
            // Clear UI canvas before drawing new frame
            ctx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);

            // Draw fading "death screen"
            ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`; // Red screen with decreasing opacity
            ctx.fillRect(0, 0, uiCanvas.width, uiCanvas.height);

            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.font = '50px Arial';
            ctx.fillText('Sit down', uiCanvas.width * 4 / 6, uiCanvas.height * 4 / 6);
            ctx.fillText('You are dead', uiCanvas.width * 1 / 4, uiCanvas.height * 1 / 6);
            ctx.fillText('Get rekt', uiCanvas.width * 3 / 4, uiCanvas.height * 2 / 6);
            ctx.fillText('rip in pizza', uiCanvas.width * 1 / 6, uiCanvas.height * 3 / 6);
            ctx.fillText('Git gud', uiCanvas.width * 2 / 6, uiCanvas.height * 5 / 6);
        };

        deathAnimation();
    }



    drawHudTexts(ctx) {
        //ctx.save();
        ctx.clearRect(0, 0, 9999, 9999);

        ctx.fillStyle = 'red';
        ctx.fillRect(5, 5, 200, 20);
        ctx.fillStyle = 'green';
        ctx.fillRect(5, 5, this.hitPoints / 100 * 200, 20);

        ctx.fillStyle = this.color;
        ctx.font = '20px Aria';
        ctx.fillText(`HP: ${this.hitPoints}`, 0, 500);
        ctx.fillText(`Ping: ${this.pingMs} ms`, 0, 525);
        ctx.fillText(`FPS: ${this.fps}`, 0, 550);
       // ctx.fillText(`Position: ${this.playerPosition.x} , ${this.playerPosition.y}`, 0, 475);
       // ctx.fillText(`Mouse pos: ${0} , ${0}`, 0, 60);
        //ctx.fillText(`Mouse angle: ${0}°`, 0, this.position.y + 75);
        //ctx.restore();
    }
}