import { type WebSocket } from 'ws'

class Player {
  static nextId = 1

  id: string
  UUID: string
  name: string
  socket: WebSocket

  constructor(UUID: string, name: string, socket: WebSocket) {
    this.id = (Player.nextId++).toString()
    this.UUID = UUID
    this.name = name
    this.socket = socket
  }

  getPublic() {
    return {
      id: this.id,
      name: this.name,
    }
  }
}

export { Player }
