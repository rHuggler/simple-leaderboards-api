import { connect, Mongoose } from 'mongoose'
import { envs } from './env'

export const connectDatabase = async (): Promise<Mongoose> => {
  return connect(envs.MONGO_URI)
}

export const disconnectDatabase = async (connection: Mongoose) => {
  await connection.disconnect()
}
