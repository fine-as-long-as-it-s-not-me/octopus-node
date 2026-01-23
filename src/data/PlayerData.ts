import { type WebSocket } from 'ws'
import { playerService } from '../services/PlayerService'

class PlayerData {
  static nextId = 1

  id: number
  UUID: string
  name: string
  socket: WebSocket
  #heartbeatInterval: NodeJS.Timeout
  roomId: number | null

  constructor(UUID: string, name: string, socket: WebSocket) {
    this.id = PlayerData.nextId++
    this.UUID = UUID
    this.name = name
    this.socket = socket
    this.#heartbeatInterval = this.#getHeartbeatInterval()
    this.roomId = null
  }

  logout() {
    clearInterval(this.#heartbeatInterval)
  }

  login(name: string, socket: WebSocket) {
    this.name = name
    this.socket = socket
    if (this.#heartbeatInterval) clearInterval(this.#heartbeatInterval)
    this.#heartbeatInterval = this.#getHeartbeatInterval()
  }

  #getHeartbeatInterval() {
    return setInterval(() => {
      playerService.sendMessage(this.id, 'player', 'heartbeat')
    }, 5000)
  }
}

export { PlayerData }
