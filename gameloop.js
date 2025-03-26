export class GameLoop {
    constructor(update, render) // pass update and render functions
    {
        this.update = update;
        this.render = render;

        this.deltaTime = 0;
        this.lastTime = 0;
        this.accumulatedTime = 0;
        this.TimeStepMs = 1000 / 60;

        this.rafId = null;
        this.isRunning = false;
    }

    mainloop(timestamp) {
        if (!this.isRunning) return;
        this.deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        this.accumulatedTime += this.deltaTime;

        while (this.accumulatedTime >= this.TimeStepMs) {
            this.update(this.TimeStepMs); //pass the fixed timestep
            this.accumulatedTime -= this.TimeStepMs;
        }
        this.render();
        this.rafId = requestAnimationFrame(this.mainloop.bind(this));
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.rafId = requestAnimationFrame(this.mainloop.bind(this));
        console.log("Gameloop started!!");
    }

    stop() {
        if (this.rafId) { cancelAnimationFrame(this.rafId); }
        this.isRunning = false;
        console.log("Gameloop stopped!!");
    }

}