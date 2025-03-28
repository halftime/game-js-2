export const radToDeg = (180 / Math.PI);

export class playerMouseEvent{
    constructor(playerid, mousePos, playerPos)
    {
        this.playerid = playerid;
        this.mousePos = mousePos;
        this.playerPos = playerPos
        this.clientTimestamp = Date.now();

        console.log("playerMouseEvent: " + JSON.stringify(this));
    }

    calculateMouseAngle (){
        return Math.atan2(this.mousePos.y - this.playerPos.y, this.mousePos.x - this.playerPos.x) * radToDeg;
    }
}

export class playerMouseMoved extends playerMouseEvent{
    constructor(playerid, mousePos, playerPos)
    {
        super(playerid, mousePos, playerPos);
        this.type = "mousemoved";
    }
}

export class playerMouseClicked extends playerMouseEvent{
    constructor(playerid, mousePos, playerPos)
    {
        super(playerid, mousePos, playerPos);
        this.type = "mouseclicked";
    }
}
