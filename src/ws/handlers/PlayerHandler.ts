import { playerService } from '../../services/PlayerService'
import { SubTypeHandlerMap } from '../types'

type PlayerRegisterData = {
  name: string
  UUID: string
}

type PlayerHandlerDataMap = {
  login: PlayerRegisterData
}

export const playerHandlers: SubTypeHandlerMap<PlayerHandlerDataMap> = {
  login(socket, data: PlayerRegisterData) {
    const { UUID, name } = data
    playerService.login(socket, UUID, name)
  },
}
