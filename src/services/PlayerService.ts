import { type WebSocket } from 'ws'
import { playerRepository } from '../repositories/PlayerRepository'

class PlayerService {
  findOrCreatePlayer(socket: WebSocket, UUID: string, name: string) {
    let player = playerRepository.findByUUID(UUID)
    if (!player) player = playerRepository.create({ UUID, name, socket })
    return player
  }
}

const playerService = new PlayerService()

export { playerService }
