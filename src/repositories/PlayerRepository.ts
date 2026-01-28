import { WebSocket } from 'ws'
import { BaseRepository } from './BaseRepository'
import { PlayerData } from '../data/PlayerData'
import { roomRepository } from './RoomRepository'
import { roomService } from '../services/RoomService'
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

    return player
  }

  getHeartbeatInterval(socket: WebSocket) {
    return setInterval(() => {
      sendSocketMessage(socket, 'player', 'heartbeat', (err) => {
        if (err) {
          if (socket.readyState === WebSocket.CLOSED) {
            const player = playerRepository.findBySocket(socket)
            if (player) this.logout(player.id)
          }
        }
      })
    }, 5000)
  }

  login(player: PlayerData, name: string, socket: WebSocket) {
    player.name = name
    player.socket = socket
    if (player.heartbeatInterval) clearInterval(player.heartbeatInterval)
    if (player.roomId) {
      const room = roomRepository.findById(player.roomId)
      if (room) roomService.join(room.code, socket, player.UUID)
    }
    player.heartbeatInterval = this.getHeartbeatInterval(player.socket)
  }

  logout(playerId: number): void {
    const player = this.findById(playerId)
    if (!player) return

    clearInterval(player.heartbeatInterval)

    console.log(`Player logged out: ${player.name} (${player.UUID})`)

    if (player.roomId) {
      const room = roomRepository.findById(player.roomId)
      if (room) roomRepository.removePlayer(room, player.id)
    }
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

  initRound(player: PlayerData): void {
    player.hasIncreasedDiscussionTime = false
    player.hasDecreasedDiscussionTime = false
    player.voted = false
  }
}

const playerRepository = new PlayerRepository('players')

export { playerRepository }
