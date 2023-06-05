import { app } from "./app"
import { config } from 'dotenv'
import { envs } from "./env"

config()

app.listen(envs.PORT, () => {
  console.log(`Listening on ${envs.PORT}...`)
})
