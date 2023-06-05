# simple-leaderboards-api
Super basic API to store and retrieve game highscore data

Every route requires a X-API-Key header

---
## Endpoints:
### GET /  
Generates a new leaderboard (make sure to copy and paste the generated ID somewhere!)

---
### GET /leaderboards/:id  
Fetch all scores from given leaderboard, sorted by highest score

---
### GET /leaderboards/:id/semicolon  
Same thing as the endpoint above but this one returns `text/plain` in the `position;player;score` format.
```
1;ronald;27
2;lucas;25
3;felipe;18
```

---
### POST /leaderboards/:id/:player/:score
Store a new score or updates a lower score

`id`: UUID v4 - Leaderboard ID  
`player`: string - Player name  
`score`: number - Score
