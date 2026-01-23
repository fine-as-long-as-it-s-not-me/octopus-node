import { playerRepository } from '../../repositories/PlayerRepository'
import { playerService } from '../../services/PlayerService'
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
    const { UUID, name } = data
    playerService.register(socket, UUID, name)
  },
}
