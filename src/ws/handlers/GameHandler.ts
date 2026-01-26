import { gameService } from '../../services/GameService'
import { SubTypeHandlerMap } from '../types'

type GameStartHandler = Record<string, never>

type GameHandlerHandlerMap = {
  start: GameStartHandler
}

export const gameHandlers: SubTypeHandlerMap<GameHandlerHandlerMap> = {
  start(socket, data: GameStartHandler) {
    // 게임 시작하기
    gameService.startGame(socket)
  },
}
