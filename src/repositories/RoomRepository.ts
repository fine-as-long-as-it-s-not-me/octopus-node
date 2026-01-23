import { DEFAULT_SETTING } from '../consts'
import { PlayerData } from '../data/PlayerData'
import { RoomData } from '../data/RoomData'
import { Setting } from '../services/types'
import { BaseRepository } from './BaseRepository'

class RoomRepository extends BaseRepository<RoomData> {
  create({
    host,
    code: roomCode,
    setting = DEFAULT_SETTING,
  }: {
    host: PlayerData
    code?: string
    setting?: Setting
  }): RoomData {
    let room = new RoomData(host, setting)

    let code = roomCode
    if (code) {
      if (this.findByCode(code)) {
        throw new Error('Room code already exists')
      }
      room.code = code
    } else {
      code = RoomData.nextCode.toString()
      while (this.findByCode(code)) {
        code = (RoomData.nextCode++).toString()
      }
    }

    room.code = code
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
    room.players.push(player)
  }
}

const roomRepository = new RoomRepository('rooms')

export { roomRepository }
