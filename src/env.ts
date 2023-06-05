export const envs = {
  PORT: process.env.PORT || '3000',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/leaderboards',
  API_KEY: process.env.API_KEY || 'asdf',
  NODE_ENV: process.env.NODE_ENV || 'test',
}
