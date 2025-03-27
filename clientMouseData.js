export const radToDeg = (180 / Math.PI);

export class playerMouseMoved{
    constructor(playerid, mouseMovedPos, playerPos)
    {
        this.playerid = playerid;
        this.mouseMovedPos = mouseMovedPos;
        this.playerPos = playerPos
        this.clientTimestamp = Date.now();
        this.type = "mousemoved";
        if (
            typeof this.mouseMovedPos.x !== 'number' || 
            typeof this.mouseMovedPos.y !== 'number' || 
            typeof this.playerPos.x !== 'number' || 
            typeof this.playerPos.y !== 'number'
        ) {
            throw new Error("mouseMovedPos and playerPos must have 'x' and 'y' as numeric values");
        }
    }

    calculateMouseAngle (){
        return Math.atan2(this.mouseMovedPos.y - this.playerPos.y, this.mouseMovedPos.x - this.playerPos.x) * radToDeg;
    }
}

export class playerMouseClicked{
    constructor(playerid, mouseClickedPos, playerPos)
    {
        this.playerid = playerid;
        this.mouseClickedPos = mouseClickedPos;
        this.playerPos = playerPos
        this.clientTimestamp = Date.now();
        this.type = "mouseclicked";
    }
}
