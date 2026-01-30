import { WebSocket } from 'ws'

export function sendSocketMessage(
  socket: WebSocket,
  type: string,
  data?: any,
  cb?: (err?: Error) => void,
): void {
  console.log(`Sending: type ${type}`)
  const message = JSON.stringify({ type, data })
  socket.send(message, cb)
}
