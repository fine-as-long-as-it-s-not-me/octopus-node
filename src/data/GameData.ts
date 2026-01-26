import { CanvasData } from './CanvasData'
import { PlayerData } from './PlayerData'
import { RoomData } from './RoomData'
import { Phase } from './types'

class GameData {
  static nextId = 1

  id: number
  room: RoomData
  totalRounds: number
  canvas: CanvasData
  scores = new Map<PlayerData, number>()
  lastPhaseChange: number = Date.now()
  intervalId: NodeJS.Timeout | null = null

  round = 0
  keyword = ''
  fakeWord = ''
  liars: PlayerData[] = []
  painter: PlayerData | null = null
  phase: Phase = Phase.INIT
  timeAlpha = 0

  constructor(room: RoomData) {
    this.room = room
    this.id = GameData.nextId++
    this.totalRounds = room.settings.rounds
    this.canvas = new CanvasData(this.id)

    this.room.players.forEach((player) => {
      this.scores.set(player, 0)
    })
  }
}

export { GameData }
