export class clientJoinReq{
    constructor(username)
    {
        this.username = username;
        this.clientTimestamp = Date.now();
        this.type = "join";
    }
}