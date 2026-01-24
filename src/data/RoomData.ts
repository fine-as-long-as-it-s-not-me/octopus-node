import { GameData } from './GameData'
import { PlayerData } from './PlayerData'
import { Chat, Settings } from './types'

class RoomData {
  static nextId = 1
  static nextCode = 1000

  id: number
  code?: string
  settings: Settings
  players: PlayerData[] = []
  customWords = new Map<string, number>()
  chats: Chat[] = []
  host: PlayerData
  game?: GameData

  constructor(host: PlayerData, settings: Settings) {
    this.id = RoomData.nextId++
    this.host = host
    this.settings = settings
  }
}

export { RoomData }
