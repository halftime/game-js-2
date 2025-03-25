const makedeathframes = (rootframe = 0) => {
    return {
        duration: 2100,
        frames:
            [
                { "time": 0, "frame": 0 },
                { "time": 10, "frame": 1 },
                { "time": 20, "frame": 2 },
                { "time": 30, "frame": 3 },
                { "time": 40, "frame": 4 },
                { "time": 50, "frame": 5 },
                { "time": 60, "frame": 6 },
                { "time": 70, "frame": 7 },
                { "time": 80, "frame": 8 },
                { "time": 90, "frame": 9 },
                { "time": 100, "frame": 10 },
                { "time": 110, "frame": 11 },
                { "time": 120, "frame": 12 },
                { "time": 130, "frame": 13 },
                { "time": 140, "frame": 14 },
                { "time": 150, "frame": 15 },
                { "time": 160, "frame": 16 },
                { "time": 170, "frame": 17 },
                { "time": 180, "frame": 18 },
                { "time": 190, "frame": 19 },
                { "time": 200, "frame": 20 },
                { "time": 250, "frame": 21 },
                { "time": 300, "frame": 22 },
                { "time": 350, "frame": 23 },
                { "time": 400, "frame": 24 },
                { "time": 450, "frame": 25 },
                { "time": 500, "frame": 26 },
                { "time": 550, "frame": 27 },
                { "time": 600, "frame": 28 },
                { "time": 650, "frame": 29 },
                { "time": 700, "frame": 30 },
                { "time": 750, "frame": 31 },
                { "time": 800, "frame": 32 },
                { "time": 850, "frame": 33 },
                { "time": 900, "frame": 34 },
                { "time": 950, "frame": 35 },
                { "time": 1000, "frame": 36 },
                { "time": 1050, "frame": 37 },
                { "time": 1100, "frame": 38 },
                { "time": 1150, "frame": 39 },
                { "time": 1200, "frame": 40 },
                { "time": 1250, "frame": 41 },
                { "time": 1300, "frame": 42 },
                { "time": 1350, "frame": 43 },
                { "time": 1400, "frame": 44 },
                { "time": 1450, "frame": 45 },
                { "time": 1500, "frame": 46 },
                { "time": 1550, "frame": 47 },
                { "time": 1600, "frame": 48 },
                { "time": 1650, "frame": 49 },
                { "time": 1700, "frame": 50 },
                { "time": 1750, "frame": 51 },
                { "time": 1800, "frame": 52 },
                { "time": 1850, "frame": 53 },
                { "time": 1860, "frame": 54 },
                { "time": 1870, "frame": 55 },
                { "time": 1880, "frame": 56 },
                { "time": 1890, "frame": 57 },
                { "time": 1900, "frame": 58 },
                { "time": 1910, "frame": 59 },
                { "time": 1920, "frame": 60 },
                { "time": 1930, "frame": 61 },
                { "time": 1940, "frame": 62 },
                { "time": 1950, "frame": 63 },
                { "time": 1960, "frame": 64 },
                { "time": 1970, "frame": 65 },
                { "time": 1980, "frame": 66 },
                { "time": 1990, "frame": 67 },
                { "time": 2000, "frame": 68 },
                { "time": 2010, "frame": 69 },
                { "time": 2020, "frame": 70 }
            ]
    }
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