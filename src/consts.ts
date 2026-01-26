import { PlayerData } from './data/PlayerData'
import { Phase, Settings } from './data/types'

export const MAX_PLAYERS = 12
export const DEFAULT_SETTING: Omit<Settings, 'lang'> = {
  rounds: 3,
  maxPlayers: 8,
  liars: 1,
  drawingTime: 15,
  useCustomWord: false,
  isCustomWordVoteOpen: false,
  customWordMinVotes: 2,
  isPublic: true,
}

export const SYSTEM = {
  id: 0,
  UUID: 'system',
  name: 'System',
}
