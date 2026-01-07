import { Room } from '../modules/room'

export function sendMessage(ws: WebSocket, type: string, data: any): void {
  const message = JSON.stringify({ type, data })
  ws.send(message)
}

export function sendRoomMessage(room: Room, type: string, data: any): void {
  const message = JSON.stringify({ type, data })
  for (const player of room.players) {
    player.ws.send(message)
  }
}
