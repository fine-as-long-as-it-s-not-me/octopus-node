import { WebSocket } from 'ws'
import { RoomData } from '../data/RoomData'

export function sendMessage(socket: WebSocket, type: string, data: any): void {
  console.log('Sending message:', { type, data })
  const message = JSON.stringify({ type, data })
  socket.send(message)
}

export function sendRoomMessage(room: RoomData, type: string, data: any): void {
  const message = JSON.stringify({ type, data })
  for (const player of room.players) {
    player.socket.send(message)
  }
}
