import { WebSocket } from 'ws'

export function sendSocketMessage(
  socket: WebSocket,
  type: string,
  data?: any,
  cb?: (err?: Error) => void,
): void {
  // Check if socket is in a state that can send messages
  if (socket.readyState !== WebSocket.OPEN) {
    const err = new Error(`Cannot send message: socket not open (readyState: ${socket.readyState})`)
    console.warn(err.message)
    if (cb) {
      cb(err)
    }
    return
  }

  console.log(`Sending: type ${type}`)
  const message = JSON.stringify({ type, data })
  
  // Use callback to handle send errors safely
  const errorSafeCallback = (err?: Error) => {
    if (err) {
      console.error(`Failed to send message (type: ${type}):`, err.message)
    }
    if (cb) {
      cb(err)
    }
  }
  
  socket.send(message, errorSafeCallback)
}
