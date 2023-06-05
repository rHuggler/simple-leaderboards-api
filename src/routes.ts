import { Router } from 'express'
import { v4 } from 'uuid'
import { LeaderboardModel, ScoreModel } from './models'

export const leaderboardsRouter = Router()

leaderboardsRouter.get('/', async (_req, res) => {
  const leaderboard = await LeaderboardModel.create({ uuid: v4() })
  res.status(201).send(leaderboard)
})

leaderboardsRouter.get('/leaderboards/:id', async (req, res) => {
  const { id } = req.params
  const leaderboard = await LeaderboardModel.findOne({ uuid: id })
  res.status(200).send(leaderboard)
})

leaderboardsRouter.post('/leaderboards/:id/:player/:score', async (req, res) => {
  const { id, player, score } = req.params
  const leaderboard = await LeaderboardModel.findOne({ uuid: id })
  const createdScore = await ScoreModel.create({ leaderboard: leaderboard?.id, player, score })
  res.status(201).send(createdScore)
})