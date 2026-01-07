import { SubTypeHandlerMap } from '../types'

type ChatSendData = {
  text: string
}

type ChatHandlerDataMap = {
  send: ChatSendData
}

export const chatHandlers: SubTypeHandlerMap<ChatHandlerDataMap> = {
  send (socket, data: ChatSendData) {
    // 채팅 보내기
  }
}
