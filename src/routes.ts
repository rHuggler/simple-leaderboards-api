import { Router } from 'express'
import { v4 } from 'uuid'

export const leaderboardsRouter = Router()

leaderboardsRouter.get('/', (_req, res) => {
  const id = v4();
  res.status(201).send({
    id,
  })
})

leaderboardsRouter.get('/leaderboards/:id', (req, res) => {
  const { id } = req.params;
  res.status(200).send({
    id
  })
})

leaderboardsRouter.get('/leaderboards/:id/:player/:score', (req, res) => {
  res.sendStatus(200)
})