import { GameData } from './GameData'
import { PlayerData } from './PlayerData'
import { Language, Settings } from './types'

class RoomData {
  static nextId = 1
  static nextCode = 1000

  id: number
  code: string
  settings: Settings
  players: PlayerData[] = []
  customWords = new Map<string, number>()
  hostId: number | null = null
  game: GameData | null = null
  lang: Language

  constructor(settings: Settings, code: string) {
    this.id = RoomData.nextId++
    this.settings = settings
    this.code = code
    this.lang = settings.lang
  }
}

export { RoomData }
