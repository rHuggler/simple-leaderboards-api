import { Request, Response } from 'express'
import { v4 } from 'uuid'
import { LeaderboardModel, Score, ScoreModel } from './models'

export const createLeaderboard = async (req: Request, res: Response) => {
  const leaderboard = await LeaderboardModel.create({ uuid: v4() })
  return res.status(201).send(leaderboard)
}

export const getLeaderboard = async (req: Request, res: Response) => {
  const { id } = req.params
  const leaderboard = await LeaderboardModel.findOne({ uuid: id })
  const scores = await ScoreModel.find({ leaderboard: leaderboard?.id }, { leaderboard: false })
  scores.sort((a, b) => a.score > b.score ? -1 : a.score < b.score ? 1 : 0)
  if (req.path.includes('semicolon')) {
    return res.status(200).send(transformLeaderboard(scores))
  }
  return res.status(200).send({
      ...leaderboard?.toJSON(),
      scores,
  })
}

export const createScore = async (req: Request, res: Response) => {
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
}

const transformLeaderboard = (scores: Score[]): string => {
  return scores.map((score, index) => `${index+1};${score.player};${score.score}`).join('\n')
}
