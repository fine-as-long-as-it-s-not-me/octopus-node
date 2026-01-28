import { RoomData } from './RoomData'
import { Phase, Score, Team } from './types'

class GameData {
  static nextId = 1

  id: number
  roomId: number
  totalRounds: number
  lastPhaseChange: number = Date.now()
  intervalId: NodeJS.Timeout | null = null
  scores = new Map<string, Score>()

  // round state
  round = 0
  keyword = ''
  fakeWord = ''
  didVoteTie = false
  octopuses: string[] = []
  votes: Map<string, number> = new Map()
  foundOctopus: boolean = false
  guessedWord: boolean = false
  winningTeam: Team | null = null

  // phase state
  phase: Phase = Phase.INIT
  canvasId: number | null = null
  painterId: number | null = null

  constructor(room: RoomData) {
    this.roomId = room.id
    this.id = GameData.nextId++
    this.totalRounds = room.settings.rounds

    room.players.forEach((player) => {
      this.scores.set(player.UUID, { total: 0, delta: 0 })
    })
  }
}

export { GameData }
