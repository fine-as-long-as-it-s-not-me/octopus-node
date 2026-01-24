import { SubTypeHandlerMap } from '../types'

type GuessSubmitHandler = {
  guessKeyword: string
}

type GuessHandlerHandlerMap = {
  submit: GuessSubmitHandler
}

export const guessHandlers: SubTypeHandlerMap<GuessHandlerHandlerMap> = {
  submit(socket, data: GuessSubmitHandler) {
    // 추리하기
  },
}
