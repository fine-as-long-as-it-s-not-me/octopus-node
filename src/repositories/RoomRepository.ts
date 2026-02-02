import { PlayerData } from '../data/PlayerData'
import { RoomData } from '../data/RoomData'
import { Language, Settings } from '../data/types'
import {
  ROOM_ADD_PLAYER_FAILED_ERROR,
  ROOM_CODE_ALREADY_EXISTS_ERROR,
  ROOM_CREATE_FAILED_ERROR,
  ROOM_NOT_FOUND_ERROR,
  ROOM_PLAYER_NOT_FOUND_ERROR,
} from '../errors/room'
import { BaseRepository } from './BaseRepository'

class RoomRepository extends BaseRepository<RoomData> {
  create({ code: roomCode, settings }: { code?: string; settings: Settings }): RoomData {
    // Validate code uniqueness
    let code = roomCode
    if (code) {
      if (this.findByCode(code)) throw ROOM_CODE_ALREADY_EXISTS_ERROR
    } else {
      code = RoomData.nextCode.toString()
      while (this.findByCode(code)) {
        code = (RoomData.nextCode++).toString()
      }
    }

    const room = new RoomData(settings, code)

    this.records.set(room.id, room)

    const res = this.findById(room.id)
    if (!res) throw ROOM_CREATE_FAILED_ERROR

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
    if (!room) throw ROOM_NOT_FOUND_ERROR

    player.roomId = roomId
    if (room.players.find((p) => p.id === player.id)) throw ROOM_ADD_PLAYER_FAILED_ERROR

    room.players.push(player)
    if (room.players.length === 1) room.hostId = player.id

    this.updateOctopusAmount(roomId)

    return true
  }

  private updateOctopusAmount(roomId: number): void {
    const room = this.findById(roomId)
    if (!room) throw ROOM_NOT_FOUND_ERROR

    room.settings.octopusAmount = 1 + Math.floor(room.players.length / 5)
  }

  removePlayer(room: RoomData, playerId: number): void {
    const player = room.players.find((p) => p.id === playerId)
    if (!player) throw ROOM_PLAYER_NOT_FOUND_ERROR

    room.players = room.players.filter((p) => p.id !== playerId)

    if (room.players.length === 0) this.delete(room.id)
    else if (room.hostId === playerId) room.hostId = room.players[0].id

    this.updateOctopusAmount(room.id)
  }

  getRandomRoom(lang: Language): RoomData | undefined {
    const publicRooms = Array.from(
      this.search((room) => room.settings.isPublic && !room.game && room.settings.lang === lang),
    )
    if (publicRooms.length === 0) return undefined
    const randomIndex = Math.floor(Math.random() * publicRooms.length)
    return publicRooms[randomIndex]
  }

  getRegisteredCustomWords(roomId: number): [string, number][] {
    const room = this.findById(roomId)
    if (!room) throw ROOM_NOT_FOUND_ERROR

    return Array.from(room.customWords.entries()).sort((a, b) => b[1] - a[1])
  }

  voteCustomWord(roomId: number, keyword: string): void {
    const room = this.findById(roomId)
    if (!room) throw ROOM_NOT_FOUND_ERROR

    if (!room.customWords.has(keyword)) {
      room.customWords.set(keyword, 0)
    }
    const currentVotes = room.customWords.get(keyword) || 0
    room.customWords.set(keyword, currentVotes + 1)
  }
}

const roomRepository = new RoomRepository('rooms')

export { roomRepository }
