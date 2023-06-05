import { Request, Response, NextFunction } from 'express'
import { envs } from './env'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers['x-api-key'] === envs.API_KEY) {
    return next()
  }

  return res.sendStatus(401)
}
