import { type WebSocket } from 'ws'
import { Language } from './types'

class PlayerData {
  static nextId = 1

  id: number
  UUID: string
  name: string
  lang: Language

  // alive states
  socket: WebSocket
  heartbeatInterval: NodeJS.Timeout

  // room states
  roomId: number | null

  // round states
  hasIncreasedDiscussionTime: boolean = false
  hasDecreasedDiscussionTime: boolean = false
  voted: boolean = false

  constructor(
    UUID: string,
    name: string,
    socket: WebSocket,
    lang: Language,
    heartbeatInterval: NodeJS.Timeout,
  ) {
    this.id = PlayerData.nextId++
    this.UUID = UUID
    this.name = name
    this.socket = socket
    this.lang = lang
    this.roomId = null
    this.heartbeatInterval = heartbeatInterval
  }
}

export { PlayerData }
