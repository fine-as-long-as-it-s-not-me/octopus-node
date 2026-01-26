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

  round = 0
  keyword = ''
  fakeWord = ''
  liars: number[] = []
  canvasId: number | null = null
  painterId: number | null = null
  phase: Phase = Phase.INIT
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
