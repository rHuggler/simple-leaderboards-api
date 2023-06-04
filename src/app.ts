import Express from 'express'
import { leaderboardsRouter } from './routes'

const app = Express()

app.use(leaderboardsRouter)

export default app
