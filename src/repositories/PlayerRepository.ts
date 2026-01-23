import { WebSocket } from 'ws'
import { BaseRepository } from './BaseRepository'
import { PlayerData } from '../data/PlayerData'

class PlayerRepository extends BaseRepository<PlayerData> {
  create({ UUID, name, socket }: Omit<PlayerData, 'id'>): PlayerData {
    const player = new PlayerData(UUID, name, socket)
    this.records.set(player.id, player)
    return player
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
}

const playerRepository = new PlayerRepository('players')

export { playerRepository }
