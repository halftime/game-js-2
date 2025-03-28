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
| random player spawns | high | in prog | 4 original spawn locations *currently forced to map[0] which is top left spawn |
| weapon spawning | high | in prog | . |
| collision check | high | in prog | basic serverside hashmap (X, Y) for fast lookup |
| dmg handling | high | in prog | . |
| logging | high | in prog | npm winston? , dump broadcast logging to file |
| player chat | mid | . | . |
| player scoreboard , stats | mid | . | . |
| control players' sprites from serverside | low | . | (client) keyUp event => server sets client sprite frame UP |
| servertick to control sprite steps | low | . | 30, 60, 120 hz server tick? |
| dont crash on malformed client comms | hi | . | . |
| migrate to ts ??? | low | . | ~~just write a game engine they said, it will be fun they said~~ | 


### ToDo Client
| Feature | Prio | State | Notes |
|---|---|---|---|
| Hud | high | ok | uiCanvas & uiCtx seperated from gameCanvas & gameCtx |
| scoreboard display | high | . | hotkey?, draw on uiCtx? | 
| chatbox | high | . | . |
| dead scene (sprite) | high | in prog | . |
| respawning | high | in prog | . | 
| smoother movement? | low | . | . |
| actual multi pc multiplayer testing | mid | . |
| audio | low | . | . |
| sprites: legs, weapons & shots | mid | in prog | frames & timing needs to be broadcasted by the server |
| migrate to ts ??? | low | . | . | 



