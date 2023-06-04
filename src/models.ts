import { Sequelize, DataTypes } from 'sequelize'

const sequelize = new Sequelize('sqlite::memory:')

const Leaderboard = sequelize.define('Leaderboard', {
  id: DataTypes.UUIDV4,
})
