# vibe coding to XGEN Valhalla
sprites & map from the OG StickArena @ http://xgenstudios.com/play/stickarena

### Game server
```
node server_.js
```

### Game client @ http://127.0.0.1:5501
```
npx http-server -p 5501
```

### ToDo serverside
  * Different player spawning locations
  * Weapon spawning
  * Weapon hit reg
  * & Damage handling
  * Trigger client sprites from serverside
     * Player keyEvent ArrowUP => set frame UP
     * Serverstep (60/120 hz) ==> client step
  * Migrating to typescript?
  * Player tags, username, ...
  * Player chat
  * Scoreboard

### ToDo clientside
  * HUD improvements
  * Scoreboard display
  * Chatbox
  * Smooth out movement?
  * Actual (local) multiplayer testing
  * Audio??
  * Sprites
      * legs
      * weapons & shots
  * Dead scene
  * & Respawning
  * Migrating to typescript?
