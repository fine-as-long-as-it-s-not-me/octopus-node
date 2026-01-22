import { PlayerRepository } from '../../repositories/PlayerRepository'
import { SubTypeHandlerMap } from '../types'

type PlayerRegisterData = {
  name: string
  UUID: string
}

type PlayerHandlerDataMap = {
  register: PlayerRegisterData
}

export const playerHandlers: SubTypeHandlerMap<PlayerHandlerDataMap> = {
  register(socket, data: PlayerRegisterData) {
    let player = PlayerRepository.getPlayer(data.UUID)
    if (player) {
      player.name = data.name
      // send player state
      return
    }
    player = PlayerRepository.createPlayer(data.UUID, data.name, socket)
    player.socket = socket
  },
}
