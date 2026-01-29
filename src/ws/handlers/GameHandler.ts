import { gameService } from '../../services/GameService'
import { SubTypeHandlerMap } from '../types'

type GameStartHandler = Record<string, never>

type GameGuessHandler = {
  word: string
}

type GameHandlerHandlerMap = {
  start: GameStartHandler
  guess: GameGuessHandler
}

export const gameHandlers: SubTypeHandlerMap<GameHandlerHandlerMap> = {
  start(socket) {
    // 게임 시작하기
    gameService.startGame(socket)
  },
  guess(socket, data: GameGuessHandler) {
    // 라이어가 제시어 추측하기
    const { word } = data
    gameService.guessWord(socket, word)
  },
}
