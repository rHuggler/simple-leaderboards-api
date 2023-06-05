import Express from 'express'
import { leaderboardsRouter } from './routes'

export const app = Express()

app.use(leaderboardsRouter)
