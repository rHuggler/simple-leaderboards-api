import { Router } from 'express'
import { createLeaderboard, createScore, getLeaderboard } from './handlers'

export const leaderboardsRouter = Router()

leaderboardsRouter.get('/', createLeaderboard)

leaderboardsRouter.get('/leaderboards/:id', getLeaderboard)

leaderboardsRouter.get('/leaderboards/:id/semicolon', getLeaderboard)

leaderboardsRouter.post('/leaderboards/:id/:player/:score', createScore)
