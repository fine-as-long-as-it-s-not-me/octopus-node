import { Language } from '../../data/types'
import { playerService } from '../../services/PlayerService'
import { SubTypeHandlerMap } from '../types'

type PlayerRegisterHandler = {
  name: string
  UUID: string
  lang: Language
}

type PlayerHandlerHandlerMap = {
  login: PlayerRegisterHandler
  change_language: { lang: Language }
}

export const playerHandlers: SubTypeHandlerMap<PlayerHandlerHandlerMap> = {
  login(socket, data: PlayerRegisterHandler) {
    const { UUID, name, lang } = data
    playerService.login(socket, UUID, name, lang)
  },
  change_language(socket, data: { lang: Language }) {
    const { lang } = data
    playerService.changeLanguage(socket, lang)
  },
}
