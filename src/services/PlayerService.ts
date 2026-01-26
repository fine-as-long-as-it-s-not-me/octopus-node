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

    if (player) playerRepository.login(player, name, socket)
    else player = playerRepository.create({ UUID, name, socket, lang })

    const responseDTO = playerRepository.getResponseDTO(player.id)
    const data = responseDTO ? { ...responseDTO } : {}
    this.sendMessage(player.id, 'hello', data)

    return player
  }

  sendMessage(playerId: number, type: string, data: any): void {
    const player = playerRepository.findById(playerId)
    if (!player) return console.error(`Player with ID ${playerId} not found`)

    sendSocketMessage(player.socket, type, data, (err) => {
      if (err) {
        if (player.socket.readyState === WebSocket.CLOSED) playerRepository.logout(player.id)
      }
    })
  }
}

const playerService = new PlayerService()

export { playerService }
