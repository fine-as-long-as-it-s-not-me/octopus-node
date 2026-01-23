import { WebSocket } from 'ws'
import { BaseRepository } from './BaseRepository'
import { PlayerData } from '../data/PlayerData'
import { roomRepository } from './RoomRepository'

class PlayerRepository extends BaseRepository<PlayerData> {
  create({ UUID, name, socket }: Pick<PlayerData, 'UUID' | 'name' | 'socket'>): PlayerData {
    const player = new PlayerData(UUID, name, socket)
    this.records.set(player.id, player)

    console.log(Array.from(this.records.values()).map((p) => p.name))

    return player
  }

  logout(playerId: number): void {
    this.records.delete(playerId)
  }

  findBySocket(socket: WebSocket): PlayerData | null {
    for (const player of this.records.values()) {
      if (player.socket === socket) {
        return player
      }
    }
    return null
  }

  findByUUID(UUID: string): PlayerData | null {
    for (const player of this.records.values()) {
      if (player.UUID === UUID) {
        return player
      }
    }
    return null
  }

  getResponseDTO(id: number) {
    const player = this.findById(id)
    if (!player) return null

    const room = player.roomId ? roomRepository.findById(player.roomId) : null

    return {
      id: player.id,
      UUID: player.UUID,
      name: player.name,
      roomCode: room ? room.code : null,
    }
  }
}

const playerRepository = new PlayerRepository('players')

export { playerRepository }
