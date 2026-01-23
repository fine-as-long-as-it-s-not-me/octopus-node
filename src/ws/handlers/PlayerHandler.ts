import { playerRepository } from '../../repositories/PlayerRepository'
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
    let player = playerRepository.findByUUID(data.UUID)
    if (player) {
      player.name = data.name
      // send player state
      return
    }
    player = playerRepository.create({ UUID: data.UUID, name: data.name, socket })
    if (!player) throw new Error('Failed to register player')
    player.socket = socket
  },
}
