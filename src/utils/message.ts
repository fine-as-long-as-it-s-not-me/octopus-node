import { WebSocket } from 'ws'
import { Room } from '../modules/room'

export function sendMessage(socket: WebSocket, type: string, data: any): void {
  const message = JSON.stringify({ type, data })
  socket.send(message)
}

export function sendRoomMessage(room: Room, type: string, data: any): void {
  const message = JSON.stringify({ type, data })
  for (const player of room.players) {
    player.socket.send(message)
  }
}
