import { myEvents } from "./events.js";

export class GameLoop {
    constructor(update, render) // pass update and render functions
    {
        this.update = update;
        this.render = render;

        this.deltaTime = 0;
        this.lastTime = 0;
        this.accumulatedTime = 0;
        this.TimeStepMs = 1000 / 60; // Set to 16.67ms for 60 FPS

        this.rafId = null;
        this.isRunning = false;

        this.myTimeStamp = Date.now();
        this.lastServerTimeStamp = Date.now();

        myEvents.on("servertime", this, (serverTimeStampMs) => {
            this.onReceivedServerTime(serverTimeStampMs);
        });
    }

    onReceivedServerTime(serverTimeStampMs)
    {
        let deltaServerTime = serverTimeStampMs - this.lastServerTimeStamp;
        this.lastServerTimeStamp = serverTimeStampMs;
        this.accumulatedTime += deltaServerTime;

        console.log("server time stamp: " + serverTimeStampMs + " deltaServerTime: " + deltaServerTime + " accumulatedTime: " + this.accumulatedTime);
    }

    mainloop(timestamp) {
        if (!this.isRunning) return;

        while (this.accumulatedTime >= this.TimeStepMs) {
            this.update(this.TimeStepMs);
            this.accumulatedTime = 0; // Reset accumulated time after update
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