import { PlayerData } from '../data/PlayerData'
import { RoomData } from '../data/RoomData'
import { Language, Settings } from '../data/types'
import { BaseRepository } from './BaseRepository'

class RoomRepository extends BaseRepository<RoomData> {
  create({ code: roomCode, settings }: { code?: string; settings: Settings }): RoomData {
    // Validate code uniqueness
    let code = roomCode
    if (code) {
      if (this.findByCode(code)) throw new Error('Room code already exists')
    } else {
      code = RoomData.nextCode.toString()
      while (this.findByCode(code)) {
        code = (RoomData.nextCode++).toString()
      }
    }

    const room = new RoomData(settings, code)

    this.records.set(room.id, room)

    const res = this.findById(room.id)
    if (!res) throw new Error('Failed to create room')

    return res
  }

  findByCode(code: string): RoomData | null {
    for (const room of this.records.values()) {
      if (room.code === code) return room
    }
    return null
  }

  addPlayer(roomId: number, player: PlayerData): boolean {
    const room = this.findById(roomId)
    if (!room) return false

    player.roomId = roomId
    if (room.players.find((p) => p.id === player.id)) return false

    room.players.push(player)
    if (room.players.length === 1) room.hostId = player.id

    return true
  }

  removePlayer(room: RoomData, playerId: number): void {
    const player = room.players.find((p) => p.id === playerId)
    if (!player) throw new Error('Player not found in room')

    room.players = room.players.filter((p) => p.id !== playerId)

    if (room.players.length === 0) this.delete(room.id)
    else if (room.hostId === playerId) room.hostId = room.players[0].id
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
