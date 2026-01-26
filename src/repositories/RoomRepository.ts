import { PlayerData } from '../data/PlayerData'
import { RoomData } from '../data/RoomData'
import { Language, Settings } from '../data/types'
import { BaseRepository } from './BaseRepository'

class RoomRepository extends BaseRepository<RoomData> {
  create({
    host,
    code: roomCode,
    settings,
  }: {
    host: PlayerData
    code?: string
    settings: Settings
  }): RoomData {
    let code = roomCode
    if (code) {
      if (this.findByCode(code)) {
        throw new Error('Room code already exists')
      }
    } else {
      code = RoomData.nextCode.toString()
      while (this.findByCode(code)) {
        code = (RoomData.nextCode++).toString()
      }
    }

    const room = new RoomData(host, settings, code)
    this.records.set(room.id, room)

    const res = this.findById(room.id)
    if (!res) throw new Error('Failed to create room')

    this.addPlayer(room.id, host)
    return res
  }

  findByCode(code: string): RoomData | null {
    for (const room of this.records.values()) {
      if (room.code === code) {
        return room
      }
    }
    return null
  }

  addPlayer(roomId: number, player: PlayerData): void {
    const room = this.findById(roomId)
    if (!room) throw new Error('Room not found')
    player.roomId = roomId
    if (room.players.find((p) => p.id === player.id)) return
    room.players.push(player)
  }

  removePlayer(roomId: number, playerId: number): void {
    const room = this.findById(roomId)
    if (!room) throw new Error('Room not found')

    const player = room.players.find((p) => p.id === playerId)
    if (!player) throw new Error('Player not found in room')

    player.roomId = null
    room.players = room.players.filter((p) => p.id !== playerId)

    if (room.players.length === 0) this.delete(roomId)
    else if (room.host.id === playerId) room.host = room.players[0]
  }

  getRandomRoom(lang: Language): RoomData | undefined {
    const publicRooms = Array.from(
      this.search((room) => room.settings.isPublic && !room.game && room.settings.lang === lang),
    )
    if (publicRooms.length === 0) return undefined
    const randomIndex = Math.floor(Math.random() * publicRooms.length)
    return publicRooms[randomIndex]
  }
}

const roomRepository = new RoomRepository('rooms')

export { roomRepository }
