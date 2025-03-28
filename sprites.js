import { Sprite } from './sprite.js';
import { resources } from './resource.js';
import { Vector } from './grid.js';
import { FrameIndexPattern } from './FrameIndexPattern.js';
import { HEARTBEATOKFRAMES, DEADFRAMES, LEGFRAMES, BACKGROUNDFRAME  } from './animations.js';

export const heartOKSprite = new Sprite({
    resource: resources.images.HUD_hb_normal,
    hFrames: 28,
    vFrames: 1,
    frameSize: { width: 27, height: 36 },
    frame: 0,
    position: new Vector(0, 0),
    scale: 2,
    rotationDeg: 0,
    animationConfig: new FrameIndexPattern(HEARTBEATOKFRAMES),
    id: 'heartOKSprite'
});

export const heartImpactedSprite = new Sprite({
    resource: resources.images.HUD_hb_impacted,
    hFrames: 36,
    vFrames: 1,
    frameSize: { width: 27, height: 36 },
    frame: 0,
    position: new Vector(0, 0),
    scale: 2,
    rotationDeg: 0,
    animationConfig: new FrameIndexPattern(HEARTBEATOKFRAMES),
    id: 'heartImpactedSprite'
});

export const heartCriticalSprite = new Sprite({
    resource: resources.images.HUD_hb_critical,
    hFrames: 36,
    vFrames: 1,
    frameSize: { width: 35, height: 36 },
    frame: 0,
    position: new Vector(0, 0),
    scale: 2,
    rotationDeg: 0,
    animationConfig: new FrameIndexPattern(HEARTBEATOKFRAMES), 
    id: 'heartCriticalSprite'
});


export const playerDeadSprite = new Sprite({
    resource: resources.images.player_dead,
    frameSize: { width: 110, height: 80 }, // 110 x 80
    hFrames: 75, vFrames: 1,
    position: new Vector(0, 0),
    frame: 0,
    scale: 1, 
    rotationDeg: 1,
    animationConfig: new FrameIndexPattern(DEADFRAMES),
    id: 'playerDeadSprite'
});

export const walkingLegsSprite = new Sprite({
    resource: resources.images.legswalking,
    frameSize: { width: 14, height: 54 },
    hFrames: 32, vFrames: 1,
    position: new Vector(-5, -15),
    frame: 0,
    scale: 1, 
    rotationDeg: 0,
    animationConfig: new FrameIndexPattern(LEGFRAMES),
    id: 'walkingLegsSprite'
});

export const gameMapSprite = new Sprite({
    resource: resources.images.mapXgenStudio,
    hFrames: 1,
    vFrames: 1,
    frameSize: { width: 1151, height: 791 },
    frame: 1,
    position: new Vector(0, 0),
    scale: 1,
    rotationDeg: 0,
    animationConfig: new FrameIndexPattern(BACKGROUNDFRAME),
    id: 'mapSprite' // Ensure unique ID
});

export const bloodSpat = new Sprite({
    resource: resources.images.hitsplat,
    frameSize: { width: 64, height: 64 },
    hFrames: 10, vFrames: 1,
    position: new Vector(0, 0),
    frame: 0,
    scale: 1, rotationDeg: 0
});

