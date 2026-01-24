import { SubTypeHandlerMap } from '../types'

type VoteCastHandler = {
  round: number
  targetId: string
}

type VoteHandlerHandlerMap = {
  cast: VoteCastHandler
}

export const voteHandlers: SubTypeHandlerMap<VoteHandlerHandlerMap> = {
  cast(socket, data: VoteCastHandler) {
    // 유저가 투표
  },
}
