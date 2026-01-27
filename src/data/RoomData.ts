import { GameData } from './GameData'
import { PlayerData } from './PlayerData'
import { Chat, Language, Settings } from './types'

class RoomData {
  static nextId = 1
  static nextCode = 1000

  id: number
  code: string
  settings: Settings
  players: PlayerData[] = []
  customWords = new Map<string, number>()
  host: PlayerData
  game: GameData | null = null
  lang: Language

  constructor(host: PlayerData, settings: Settings, code: string) {
    this.id = RoomData.nextId++
    this.host = host
    this.settings = settings
    this.code = code
    this.lang = host.lang
  }
}

export { RoomData }
