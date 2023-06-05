import { app } from "./app"
import { config } from 'dotenv'
import { envs } from "./env"
import { connectDatabase } from "./database"

config()

connectDatabase()

app.listen(envs.PORT, () => {
  console.log(`Listening on ${envs.PORT}...`)
})
