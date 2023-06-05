import { Router } from 'express'
import { v4 } from 'uuid'
import { LeaderboardModel, ScoreModel } from './models'

export const leaderboardsRouter = Router()

leaderboardsRouter.get('/', async (_req, res) => {
  const leaderboard = await LeaderboardModel.create({ uuid: v4() })
  return res.status(201).send(leaderboard)
})

leaderboardsRouter.get('/leaderboards/:id', async (req, res) => {
  const { id } = req.params
  const leaderboard = await LeaderboardModel.findOne({ uuid: id })
  const scores = await ScoreModel.find({ leaderboard: leaderboard?.id }, { leaderboard: false })
  scores.sort((a, b) => a.score > b.score ? -1 : a.score < b.score ? 1 : 0)
  return res.status(200).send({
      ...leaderboard?.toJSON(),
      scores: scores.map(score => score.toJSON())
  })
})

leaderboardsRouter.post('/leaderboards/:id/:player/:score', async (req, res) => {
  const { id, player, score } = req.params
  const existingLeaderboard = await LeaderboardModel.findOne({ uuid: id })
  const leaderboard = existingLeaderboard?.id
  const existingScore = await ScoreModel.findOne({ leaderboard, player })
  if (!existingScore) {
    const createdScore = await ScoreModel.create({ leaderboard, player, score })
    return res.status(201).send(createdScore)
  }
  if (existingScore.score > parseInt(score)) {
    return res.sendStatus(304)
  }
  const updatedScore = await ScoreModel.updateOne({ leaderboard, player }, { score }, { new: true })
  return res.status(200).send(updatedScore)
})
