import Express from 'express'
import { leaderboardsRouter } from './routes'
import { authMiddleware } from './auth'
import cors from 'cors'

export const app = Express()

app.use(cors())
app.use(authMiddleware)
app.use(leaderboardsRouter)
