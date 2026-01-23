import { GameData } from './GameData'
import { PlayerData } from './PlayerData'
import { Chat, Setting } from './types'

class RoomData {
  static nextId = 1
  static nextCode = 1000

  id: number
  code?: string
  setting: Setting
  players: PlayerData[] = []
  customWords = new Map<string, number>()
  chats: Chat[] = []
  host: PlayerData
  game?: GameData

  constructor(host: PlayerData, setting: Setting) {
    this.id = RoomData.nextId++
    this.host = host
    this.setting = setting
  }
}

export { RoomData }
