import { WebSocket } from 'ws'
import { Player } from '../services/PlayerService'

class PlayerRepository {
  static players: Player[] = []

  static getPlayerBySocket(socket: WebSocket): Player | null {
    // 소켓으로 플레이어를 찾는 로직
    return null
  }
  static getPlayer(UUID: string): Player | null {
    return this.players.find((player) => player.id === UUID) || null
  }

  static createPlayer(UUID: string, name: string, socket: WebSocket): Player {
    const player = new Player(UUID, name, socket) // You might want to handle the socket assignment properly
    player.id = UUID
    this.players.push(player)
    return player
  }
}

export { PlayerRepository }
