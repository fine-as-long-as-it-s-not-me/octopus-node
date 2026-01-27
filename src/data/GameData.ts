import { CanvasData } from './CanvasData'
import { RoomData } from './RoomData'
import { Phase } from './types'

class GameData {
  static nextId = 1

  id: number
  roomId: number
  totalRounds: number
  scores = new Map<number, number>()
  lastPhaseChange: number = Date.now()
  intervalId: NodeJS.Timeout | null = null

  // round state
  round = 0
  keyword = ''
  fakeWord = ''
  liars: number[] = []
  votes: Map<number, number> = new Map()

  // phase state
  phase: Phase = Phase.INIT
  canvasId: number | null = null
  painterId: number | null = null
  timeAlpha = 0

  constructor(room: RoomData) {
    this.roomId = room.id
    this.id = GameData.nextId++
    this.totalRounds = room.settings.rounds

    room.players.forEach((player) => {
      this.scores.set(player.id, 0)
    })
  }
}

export { GameData }
