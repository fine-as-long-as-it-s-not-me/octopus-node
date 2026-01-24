import { SubTypeHandlerMap } from '../types'

type KickVoteHandler = {
  targetId: string
  agree: boolean
}

type KickHandlerHandlerMap = {
  vote: KickVoteHandler
}

export const kickHandlers: SubTypeHandlerMap<KickHandlerHandlerMap> = {
  vote(socket, data: KickVoteHandler) {
    // 강퇴 투표
  },
}
