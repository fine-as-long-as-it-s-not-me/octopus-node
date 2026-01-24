import { Settings } from './data/types'

export const MAX_PLAYERS = 12
export const DEFAULT_SETTING: Settings = {
  rounds: 3,
  maxPlayers: 8,
  liars: 1,
  drawingTime: 15,
  useCustomWord: false,
  isCustomWordVoteOpen: false,
  customWordMinVotes: 2,
  isPublic: true,
  language: 'en',
}
