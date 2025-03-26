const makedeathframes = (rootframe = 0) => {
    const duration = 2100;
    const totalFrames = 73; // Number of frames based on the original frameTimes array
    const frameTimeIncrement = duration / totalFrames; // Calculate time increment per frame
    const frames = [];

    for (let i = 0; i < totalFrames; i++) {
        frames.push({
            "time": Math.round(i * frameTimeIncrement),
            "frame": rootframe + i
        });
    }

    return {
        duration: duration,
        frames: frames
    };
}

const makeHeartBeatOkFrames = (rootframe = 0) => { // same timing for other heartbeats
    const totalFrames = 36;
    const duration = 1000;
    const frameTime = duration / totalFrames;
    
    let frames = [];
    
    for (let i = 0; i < totalFrames; i++) {
        frames.push({
            "time": Math.round(i * frameTime),
            "frame": rootframe + i
        });
    }

    return {
        duration: duration,
        frames: frames
    };
};

const makeLegFrames = (rootframe = 0) => {
    const totalFrames = 32;
    const duration = 2000;
    const frameTime = duration / totalFrames;
    
    let frames = [];
    
    for (let i = 0; i < totalFrames; i++) {
        frames.push({
            "time": Math.round(i * frameTime),
            "frame": rootframe + i
        });
    }

    return {
        duration: duration,
        frames: frames
    };
}



export const DEADFRAMES = makedeathframes(0);
export const HEARTBEATOKFRAMES = makeHeartBeatOkFrames(0);
export const LEGFRAMES = makeLegFrames(0);
export const BACKGROUNDFRAME = {duration: 0, frames: [{time: 0, frame: 0}]};