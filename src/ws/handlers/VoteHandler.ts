import { gameService } from '../../services/GameService'
import { SubTypeHandlerMap } from '../types'

type VoteCastHandler = {
  targetUUID: string
}

type VoteHandlerHandlerMap = {
  cast: VoteCastHandler
}

export const voteHandlers: SubTypeHandlerMap<VoteHandlerHandlerMap> = {
  cast(socket, data: VoteCastHandler) {
    // 유저가 투표
    const { targetUUID } = data
    gameService.vote(socket, targetUUID)
  },
}
