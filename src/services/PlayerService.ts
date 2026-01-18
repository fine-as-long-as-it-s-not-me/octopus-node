import { type WebSocket } from 'ws'

class Player {
  static nextId = 1

  static getPlayerBySocket(socket: WebSocket): Player | null {
    // 소켓으로 플레이어를 찾는 로직
    return null
  }

  id: string
  name: string
  socket: WebSocket

  constructor(name: string, socket: WebSocket) {
    this.id = (Player.nextId++).toString()
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
