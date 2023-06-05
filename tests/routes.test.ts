import request from 'supertest'
import { app } from '../src/app'
import { connectDatabase, disconnectDatabase, dropCollections } from './test_database'
import { LeaderboardModel, ScoreModel } from '../src/models'
import { config } from 'dotenv'
config()

beforeAll(async () => {
  await connectDatabase()
})

afterAll(async () => {
  await disconnectDatabase()
})

afterEach(async () => {
  await dropCollections()
})

describe("Test database connection", () => {
  test("It should be able to query the leaderboards database", async () => {
    const result = await LeaderboardModel.find()
    expect(Array.isArray(result)).toBe(true)
  })
})

describe("Test route /", () => {
  const route = '/'

  test("It should respond the GET method", async () => {
    const response = await request(app).get(route)
    expect(response.statusCode).toBe(201)
  })

  test("It should respond with new leaderboard id", async () => {
    const response = await request(app).get(route)
    expect(response.body).toHaveProperty('uuid')
  })

  test("Leaderboard id must have v4 UUID format", async () => {
    const response = await request(app).get(route)
    expect(response.body.uuid).toMatch(/^[\w\d]{8}-(?:[\w\d]{4}-){3}[\w\d]{12}$/gm)
  })

  test("It should create a leaderboard on database", async () => {
    const response = await request(app).get(route)
    const result = await LeaderboardModel.findOne({ uuid: response.body.uuid })
    expect(result?.uuid).toBe(response.body.uuid)
  })
})

describe("Test route /leaderboards", () => {
  const route = '/leaderboards'
  const leaderboardId = '76576c26-b356-4eb9-a00e-4f1df9aa6f8a'
  const playerId = 'ronald'
  const score = '50'

  beforeEach(async () => {
    await LeaderboardModel.create({ uuid: leaderboardId })
  })

  test("It should NOT respond the GET method", async () => {
    const response = await request(app).get(route)
    expect(response.status).toBe(404)
  })

  test("It should NOT respond the POST method", async () => {
    const response = await request(app).post(route)
    expect(response.status).toBe(404)
  })

  describe("Test route /leaderboards/:id", () => {
    test("It should respond the GET method", async () => {
      const response = await request(app).get(`${route}/${leaderboardId}`)
      expect(response.status).toBe(200)
    })

    test("It should get the leaderboard from database", async () => {
      const response = await request(app).get(`${route}/${leaderboardId}`)
      expect(response.body.uuid).toBe(leaderboardId)
    })

    test("It should get all scores from specified leaderboard", async () => {
      await request(app).post(`${route}/${leaderboardId}/${playerId}/${score}`)
      await request(app).post(`${route}/${leaderboardId}/Felipe/40`)
      const response = await request(app).get(`${route}/${leaderboardId}`)
      expect(response.body.scores).toHaveLength(2)
    })

    test("It should return scores ordered from highest to lowest", async () => {
      await request(app).post(`${route}/${leaderboardId}/Lucas/20`)
      await request(app).post(`${route}/${leaderboardId}/${playerId}/${score}`)
      await request(app).post(`${route}/${leaderboardId}/Felipe/40`)
      const response = await request(app).get(`${route}/${leaderboardId}`)
      const [ highestScore, middleScore, lowestScore ] = response.body.scores
      expect(highestScore.score).toBeGreaterThan(middleScore.score)
      expect(middleScore.score).toBeGreaterThan(lowestScore.score)
    })
  })

  describe("Test route /leaderboards/:id/:player/:score", () => {
    test("It should respond the POST method", async () => {
      const response = await request(app).post(`${route}/${leaderboardId}/${playerId}/${score}`)
      expect(response.status).toBe(201)
    })

    test("It should create a new score", async () => {
      await request(app).post(`${route}/${leaderboardId}/${playerId}/${score}`)
      const leaderboard = await LeaderboardModel.findOne({ uuid: leaderboardId })
      const result = await ScoreModel.find({ leaderboard: leaderboard?.id })
      expect(result).toHaveLength(1)
    })

    test("It should NOT create more than one score for the same player", async () => {
      await request(app).post(`${route}/${leaderboardId}/${playerId}/20`)
      await request(app).post(`${route}/${leaderboardId}/${playerId}/${score}`)
      const leaderboard = await LeaderboardModel.findOne({ uuid: leaderboardId })
      const result = await ScoreModel.find({ leaderboard: leaderboard?.id })
      expect(result).toHaveLength(1)
    })

    test("It should update score only if new score is higher", async () => {
      await request(app).post(`${route}/${leaderboardId}/${playerId}/${score}`)
      const response = await request(app).post(`${route}/${leaderboardId}/${playerId}/20`)
      const leaderboard = await LeaderboardModel.findOne({ uuid: leaderboardId })
      const result = await ScoreModel.find({ leaderboard: leaderboard?.id })
      expect(result).toHaveLength(1)
      expect(result[0].score.toString()).toBe(score)
      expect(response.status).toBe(304)
    })
  })
})
