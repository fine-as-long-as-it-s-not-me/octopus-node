import { roomService } from '../../services/RoomService'
import { SubTypeHandlerMap } from '../types'

type ChatSendHandler = {
  text: string
}

type ChatHandlerHandlerMap = {
  send: ChatSendHandler
}

export const chatHandlers: SubTypeHandlerMap<ChatHandlerHandlerMap> = {
  send(socket, data: ChatSendHandler) {
    // 채팅 보내기
    const { text } = data
    roomService.addChatMessage(socket, text)
  },
}
