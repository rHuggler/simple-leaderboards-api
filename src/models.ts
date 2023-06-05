import { prop, Ref, getModelForClass } from '@typegoose/typegoose'

export class Leaderboard {
  @prop()
  public uuid!: string
}

export class Score {
  @prop({ ref: () => Leaderboard })
  public leaderboard!: Ref<Leaderboard>

  @prop()
  public player!: string

  @prop()
  public score!: number
}

export const LeaderboardModel = getModelForClass(Leaderboard)
export const ScoreModel = getModelForClass(Score)
