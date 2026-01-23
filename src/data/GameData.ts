import { CanvasData } from './CanvasData'
import { PlayerData } from './PlayerData'
import { RoomData } from './RoomData'

class GameData {
  static nextId = 1

  id: number
  totalRounds: number
  room: RoomData
  canvas: CanvasData = new CanvasData()
  scores = new Map<PlayerData, number>()
  round = 0

  constructor(room: RoomData, totalRounds: number) {
    this.room = room
    this.id = GameData.nextId++
    this.totalRounds = totalRounds

    this.room.players.forEach((player) => {
      this.scores.set(player, 0)
    })
  }
}

export { GameData }
