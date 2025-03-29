# vibe coding to XGEN Valhalla
sprites & map from the OG StickArena @ http://xgenstudios.com/play/stickarena

embrace the vibes & nostalgia https://youtube.com/watch?v=Idi0frp_854

### Game server
```
node server_.js
```

### Game client @ http://127.0.0.1:5501
```
npx http-server -p 5501
```

### ToDo Server
| Feature | Prio | State | Notes |
|---|---|---|---|
| random player spawns | high | in prog | 4 original spawn locations ~~*currently forced to map[0] which is top left spawn~~ |
| weapon spawning | high | in prog | . |
| player collision check | high | in prog | basic serverside hashmap (X, Y) for fast lookup |
| & projectiles | high | in prog | extrapolate vector (player ; click) to target w collision checks |
| dmg handling | high | in prog | https://stickarena.fandom.com/wiki/Weapons |
| logging | high | in prog | npm winston? , dump broadcast logging to file |
| player chat | mid | . | . |
| (chat) killfeed | high | in prog | used data from stickarena.fandom.com & added extra spice |
| player scoreboard , stats | mid | . | . |
| control players' sprites from serverside | low | . | ie: build & control the whole playerobj incl children on serverside => broadcast to client(s) |
| servertick to control sprite steps | low | . | 60, 120 hz plausible? |
| error handling sockets, etc | mid | . | maybe do error handling after porting to TS |
| migrate to ts ??? | low | . | ~~just write a game engine they said, it will be fun they said~~ | 


### ToDo Client
| Feature | Prio | State | Notes |
|---|---|---|---|
| Hud | high | ok | UI seperate from game Canvas |
| Player "camera" | high | ok | following the player around the map |
| scoreboard display | high | . | hotkey?, draw on uiCtx? | 
| chatbox | high | . | . |
| dead scene (sprite) | high | in prog | . |
| (re)spawning | high | in prog | . | 
| smoother movement? | low | . | . |
| actual multi pc multiplayer testing | mid | . |
| audio | low | . | . |
| sprites: legs, weapons & shots | mid | in prog | frames & timing needs to be broadcasted by the server |
| migrate to ts ??? | low | . | . | 



