import Express from 'express'
import { leaderboardsRouter } from './routes'
import { authMiddleware } from './auth'

export const app = Express()

app.use(authMiddleware)
app.use(leaderboardsRouter)
