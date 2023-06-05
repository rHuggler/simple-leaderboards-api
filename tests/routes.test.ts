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
      expect(response.body._id).toBeDefined()
    })
  })

  describe("Test route /leaderboards/:id/:player/:score", () => {
    test("It should respond the POST method", async () => {
      const response = await request(app).post(`${route}/${leaderboardId}/${playerId}/${score}`)
      expect(response.status).toBe(201)
    })

    test("It should create a new score", async () => {
      const response = await request(app).post(`${route}/${leaderboardId}/${playerId}/${score}`)
      const leaderboard = await LeaderboardModel.findOne({ uuid: leaderboardId })
      const result = await ScoreModel.find({ leaderboard: leaderboard?.id })
      expect(result).toHaveLength(1)
      expect(response.body._id).toBeDefined()
    })
  })
})
