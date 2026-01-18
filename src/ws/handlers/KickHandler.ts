import { SubTypeHandlerMap } from '../types'

type KickVoteData = {
  targetId: string
  agree: boolean
}

type KickHandlerDataMap = {
  vote: KickVoteData
}

export const kickHandlers: SubTypeHandlerMap<KickHandlerDataMap> = {
  vote(socket, data: KickVoteData) {
    // 강퇴 투표
  },
}
