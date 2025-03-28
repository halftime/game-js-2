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
    spriteNameId: 'heartOKSprite'
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
    spriteNameId: 'heartImpactedSprite'
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
    spriteNameId: 'heartCriticalSprite'
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
    spriteNameId: 'playerDeadSprite'
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
    spriteNameId: 'walkingLegsSprite'
});

export const backgroundSprite = new Sprite({
    resource: resources.images.mapXgenStudio,
    hFrames: 1,
    vFrames: 1,
    frameSize: { width: 700, height: 500 },
    frame: 1,
    position: new Vector(0, 0),
    scale: 1,
    rotationDeg: 0,
   // animationConfig: new FrameIndexPattern(BACKGROUNDFRAME),
    spriteNameId: 'backgroundSprite' // Ensure unique ID
});

export const bloodSpat = new Sprite({
    resource: resources.images.hitsplat,
    frameSize: { width: 64, height: 64 },
    hFrames: 10, vFrames: 1,
    position: new Vector(0, 0),
    frame: 0,
    scale: 1, rotationDeg: 0
});

