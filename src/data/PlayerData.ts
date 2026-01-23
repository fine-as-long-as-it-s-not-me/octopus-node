import { type WebSocket } from 'ws'

class PlayerData {
  static nextId = 1

  id: number
  UUID: string
  name: string
  socket: WebSocket

  constructor(UUID: string, name: string, socket: WebSocket) {
    this.id = PlayerData.nextId++
    this.UUID = UUID
    this.name = name
    this.socket = socket
  }

  getResponseDTO() {
    return {
      id: this.id,
      UUID: this.UUID,
      name: this.name,
    }
  }
}

export { PlayerData }
