import { Setting } from './data/types'

export const MAX_PLAYERS = 12
export const DEFAULT_SETTING: Setting = {
  rounds: 3,
  maxPlayers: 8,
  liars: 1,
  drawingTime: 15,
  customWords: false,
  roomType: 'public',
}
