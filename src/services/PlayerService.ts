import { WebSocket } from 'ws'
import { playerRepository } from '../repositories/PlayerRepository'
import { Language } from '../data/types'
import { sendSocketMessage } from '../lib/socket'

class PlayerService {
  changeLanguage(socket: WebSocket, lang: Language): void {
    const player = playerRepository.findBySocket(socket)
    if (!player) return sendSocketMessage(socket, 'unregistered')

    player.lang = lang
    this.sendMessage(player.id, 'languageChanged', { lang }) // no use in client
  }

  login(socket: WebSocket, UUID: string, name: string, lang: Language) {
    let player = playerRepository.findByUUID(UUID)
    if (player) {
      playerRepository.login(player, name, socket)
      console.log(`Player logged in: ${name} (${UUID})`)
    } else {
      player = playerRepository.create({ UUID, name, socket, lang })
      console.log(`New player registered: ${name} (${UUID})`)
    }

    this.sendMessage(player.id, 'hello', playerRepository.getResponseDTO(player.id))

    return player
  }

  logout(playerId: number) {
    playerRepository.logout(playerId)
  }

  sendMessage(playerId: number, type: string, data: any): void {
    const player = playerRepository.findById(playerId)
    if (!player) return console.error(`Player with ID ${playerId} not found`)

    console.log('Sending message:', { type, data }, player.UUID)

    sendSocketMessage(player.socket, type, data, (err) => {
      if (err) {
        if (player.socket.readyState === WebSocket.CLOSED) this.logout(player.id)
      }
    })
  }
}

const playerService = new PlayerService()

export { playerService }
