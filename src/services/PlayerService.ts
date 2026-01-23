import { type WebSocket } from 'ws'
import { playerRepository } from '../repositories/PlayerRepository'

class PlayerService {
  register(socket: WebSocket, UUID: string, name: string) {
    let player = playerRepository.findByUUID(UUID)
    if (player) {
      player.name = name
      player.socket = socket
      console.log(`Player reconnected: ${name} (${UUID})`)
    } else {
      player = playerRepository.create({ UUID, name, socket })
      console.log(`New player registered: ${name} (${UUID})`)
    }

    this.sendMessage(player.id, 'hello', player.getResponseDTO())

    return player
  }

  sendMessage(playerId: number, type: string, data: any): void {
    const player = playerRepository.findById(playerId)
    if (!player) return console.error(`Player with ID ${playerId} not found`)

    console.log('Sending message:', { type, data }, player.UUID)

    const message = JSON.stringify({ type, data })
    player.socket.send(message)
  }
}

const playerService = new PlayerService()

export { playerService }
