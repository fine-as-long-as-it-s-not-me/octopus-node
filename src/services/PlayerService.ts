import { WebSocket } from 'ws'
import { playerRepository } from '../repositories/PlayerRepository'
import { Language } from '../data/types'
import { sendSocketMessage } from '../lib/socket'
import { PLAYER_UNREGISTERED_ERROR } from '../errors/player'

class PlayerService {
  changeLanguage(socket: WebSocket, lang: Language): void {
    const player = playerRepository.findBySocket(socket)
    if (!player) throw PLAYER_UNREGISTERED_ERROR

    player.lang = lang
    this.sendMessage(player.id, 'language_changed', { lang }) // no use in client
  }

  login(socket: WebSocket, UUID: string, name: string, lang: Language) {
    let player = playerRepository.findByUUID(UUID)

    if (player) playerRepository.login(player, name, socket)
    else player = playerRepository.create({ UUID, name, socket, lang })

    const responseDTO = playerRepository.getResponseDTO(player.id)
    const data = responseDTO ? { ...responseDTO } : {}
    this.sendMessage(player.id, 'player_logged_in', data)

    return player
  }

  logout(socket: WebSocket): void {
    const player = playerRepository.findBySocket(socket)
    if (!player) throw PLAYER_UNREGISTERED_ERROR

    playerRepository.logout(player.id)
    this.sendMessage(player.id, 'player_logged_out', {})
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

  pong(socket: WebSocket): void {
    const player = playerRepository.findBySocket(socket)
    if (!player) throw PLAYER_UNREGISTERED_ERROR

    this.sendMessage(player.id, 'pong', {})
  }
}

const playerService = new PlayerService()

export { playerService }
