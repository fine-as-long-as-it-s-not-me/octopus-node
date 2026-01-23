import { WebSocket } from 'ws'
import { playerRepository } from '../repositories/PlayerRepository'
import { roomService } from './RoomService'

class PlayerService {
  login(socket: WebSocket, UUID: string, name: string) {
    let player = playerRepository.findByUUID(UUID)
    if (player) {
      player.login(name, socket)
      console.log(`Player logged in: ${name} (${UUID})`)
    } else {
      player = playerRepository.create({ UUID, name, socket })
      console.log(`New player registered: ${name} (${UUID})`)
    }

    this.sendMessage(player.id, 'hello', playerRepository.getResponseDTO(player.id))

    return player
  }

  logout(playerId: number) {
    const player = playerRepository.findById(playerId)
    if (!player) return console.error(`Player with ID ${playerId} not found`)

    player.logout()
    console.log(`Player logged out: ${player.name} (${player.UUID})`)

    if (player.roomId) {
      roomService.removePlayer(player.roomId, player.id)
    }
  }

  sendMessage(playerId: number, type: string, data: any): void {
    const player = playerRepository.findById(playerId)
    if (!player) return console.error(`Player with ID ${playerId} not found`)

    console.log('Sending message:', { type, data }, player.UUID)

    const message = JSON.stringify({ type, data })
    player.socket.send(message, (err) => {
      if (err) {
        if (player.socket.readyState === WebSocket.CLOSED) this.logout(player.id)
      }
    })
  }
}

const playerService = new PlayerService()

export { playerService }
