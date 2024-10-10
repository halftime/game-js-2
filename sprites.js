import { Sprite } from './sprite.js';
import { resources } from './resource.js';
import { Vector } from './grid.js';
import { FrameIndexPattern } from './FrameIndexPattern.js';
import { HEARTBEATOKFRAMES, DEADFRAMES, LEGFRAMES  } from './animations.js';

export const heartbeatSprite = new Sprite({
    resource: resources.images.HUD_hb_normal,
    hFrames: 28,
    vFrames: 1,
    frameSize: { width: 27, height: 27 },
    frame: 0,
    position: new Vector(10, 10),
    scale: 2,
    rotation: 0,
    animationConfig: new FrameIndexPattern(HEARTBEATOKFRAMES)
});

export const playerDeadSprite = new Sprite({
    resource: resources.images.player_dead,
    frameSize: { width: 110, height: 80 }, // 110 x 80
    hFrames: 75, vFrames: 1,
    position: new Vector(0, 0),
    frame: 0,
    scale: 1, rotation: 0,
    animationConfig: new FrameIndexPattern(DEADFRAMES)
});

export const walkingLegsSprite = new Sprite({
    resource: resources.images.legswalking,
    frameSize: { width: 14, height: 54 },
    hFrames: 32, vFrames: 1,
    position: new Vector(-10, -20),
    frame: 0,
    scale: 1, rotation: 0,
    animationConfig: new FrameIndexPattern(LEGFRAMES)
});

export const backgroundSprite = new Sprite({
    resource: resources.images.mapXgenStudio,
    hFrames: 1,
    vFrames: 1,
    frameSize: { width: 1151, height: 791 },
    frame: 0,
    position: new Vector(0, 0),
    scale: 1,
    rotation: 0
});