import { Player } from './PlayerService'
import { Room } from './RoomService'
import { GamePhaseType } from './types'

export class Round {
  room: Room
  round: number
  octopus: Player
  phase: GamePhaseType = 'pending'
  category = ''
  keyword = ''
  drawingData = []

  constructor(room: Room, round: number) {
    this.room = room
    this.round = round
    this.octopus = this.getNewOctopus()
  }

  getNewOctopus(): Player {
    const n = this.room.players.size
    const randomIndex = Math.floor(Math.random() * n)
    return Array.from(this.room.players)[randomIndex]
  }
}
