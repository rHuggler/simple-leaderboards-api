import mongoose, { Mongoose } from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

const mongo = MongoMemoryServer.create()

export const connectDatabase = async (): Promise<Mongoose> => {
  const uri = (await mongo).getUri()
  return mongoose.connect(uri)
}

export const disconnectDatabase = async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await (await mongo).stop()
}

export const dropCollections = async () => {
  for (const key of Object.values(mongoose.connection.collections)) {
    await key.deleteMany()
  }
}
