import { SubTypeHandlerMap } from '../types'

type VoteCastData = {
  round: number
  targetId: string
}

type VoteHandlerDataMap = {
  cast: VoteCastData
}

export const voteHandlers: SubTypeHandlerMap<VoteHandlerDataMap> = {
  cast(socket, data: VoteCastData) {
    // 유저가 투표
  },
}
