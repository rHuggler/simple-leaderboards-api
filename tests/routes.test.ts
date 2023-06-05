import request from 'supertest'
import { app } from '../src/app'

describe("Test /", () => {
  const route = '/'

  test("It should respond the GET method", async () => {
    const response = await request(app).get(route)
    expect(response.statusCode).toBe(201)
  })

  test("It should respond with new leaderboard id", async () => {
    const response = await request(app).get(route)
    expect(response.body).toHaveProperty('id')
  })

  test("Leaderboard id must have v4 UUID format", async () => {
    const response = await request(app).get(route)
    expect(response.body.id).toMatch(/^[\w\d]{8}-(?:[\w\d]{4}-){3}[\w\d]{12}$/gm)
  })
})

describe("Test /leaderboards", () => {
  const route = '/leaderboards'
  const leaderboardId = '76576c26-b356-4eb9-a00e-4f1df9aa6f8a'
  const playerId = 'ronald'
  const score = '50'

  test("It should NOT respond the GET method", async () => {
    const response = await request(app).get(route)
    expect(response.status).toBe(404)
  })

  test("It should NOT respond the POST method", async () => {
    const response = await request(app).post(route)
    expect(response.status).toBe(404)
  })

  describe("Test /leaderboards/:id", () => {
    test("It should respond the GET method", async () => {
      const response = await request(app).get(`${route}/${leaderboardId}`)
      expect(response.status).toBe(200)
    })

    test("It should get the leaderboard matching the provided id", async () => {
      const response = await request(app).get(`${route}/${leaderboardId}`)
      expect(response.body.id).toBe(leaderboardId)
    })
  })

  describe("Test /leaderboards/:id/:player/:score", () => {
    test("It should respond the GET method", async () => {
      const response = await request(app).get(`${route}/${leaderboardId}/${playerId}/${score}`)
      expect(response.status).toBe(200)
    })
  })
})