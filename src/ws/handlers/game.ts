import { SubTypeHandlerMap } from '../types'

type GameStartData = Record<string, never>

type GameHandlerDataMap = {
  start: GameStartData
}

export const gameHandlers: SubTypeHandlerMap<GameHandlerDataMap> = {
  start(socket, data: GameStartData) {
    // 게임 시작하기
  },
}
