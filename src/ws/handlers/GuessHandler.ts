import { SubTypeHandlerMap } from '../types'

type GuessSubmitData = {
  guessKeyword: string
}

type GuessHandlerDataMap = {
  submit: GuessSubmitData
}

export const guessHandlers: SubTypeHandlerMap<GuessHandlerDataMap> = {
  submit(socket, data: GuessSubmitData) {
    // 추리하기
  },
}
