import { WebSocket } from 'ws'
import { sendSocketMessage } from '../lib/socket'
import { playerRepository } from '../repositories/PlayerRepository'
import { roomRepository } from '../repositories/RoomRepository'
import { roomService } from './RoomService'

class ChatService {
  addChatMessage(socket: WebSocket, text: string): void {
    const player = playerRepository.findBySocket(socket)
    if (!player || !player.roomId) return sendSocketMessage(socket, 'error')

    const room = roomRepository.findById(player.roomId)
    if (!room) return sendSocketMessage(socket, 'error')

    roomService.sendMessage(room, 'chat_added', {
      player: playerRepository.getResponseDTO(player.id),
      text,
    })
  }

  addSystemChatMessage(roomId: number, type: string, variable?: object): void {
    const room = roomRepository.findById(roomId)
    if (!room) return

    roomService.sendMessage(room, 'system_chat', {
      type,
      variable,
    })
  }
}

const chatService = new ChatService()

export { chatService }
