import { WebSocket } from 'ws'
import { BaseRepository } from './BaseRepository'
import { PlayerData } from '../data/PlayerData'
import { roomRepository } from './RoomRepository'
import { roomService } from '../services/RoomService'
import { playerService } from '../services/PlayerService'
import { sendSocketMessage } from '../lib/socket'

class PlayerRepository extends BaseRepository<PlayerData> {
  create({
    UUID,
    name,
    socket,
    lang,
  }: Pick<PlayerData, 'UUID' | 'name' | 'socket' | 'lang'>): PlayerData {
    const player = new PlayerData(UUID, name, socket, lang, this.getHeartbeatInterval(socket))
    this.records.set(player.id, player)

    console.log(Array.from(this.records.values()).map((p) => p.name))

    return player
  }

  login(player: PlayerData, name: string, socket: WebSocket) {
    player.name = name
    player.socket = socket
    if (player.heartbeatInterval) clearInterval(player.heartbeatInterval)
    player.heartbeatInterval = this.getHeartbeatInterval(player.socket)
  }

  getHeartbeatInterval(socket: WebSocket) {
    return setInterval(() => {
      sendSocketMessage(socket, 'player', 'heartbeat')
    }, 5000)
  }

  logout(playerId: number): void {
    const player = this.findById(playerId)
    if (!player) return

    clearInterval(player.heartbeatInterval)

    this.records.delete(playerId)
    if (player.roomId) roomRepository.removePlayer(player.roomId, player.id)

    console.log(`Player logged out: ${player.name} (${player.UUID})`)
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
