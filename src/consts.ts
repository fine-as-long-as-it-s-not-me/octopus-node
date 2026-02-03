import { Settings } from './data/types'

export const MAX_PLAYERS = 12
export const DEFAULT_SETTING: Omit<Settings, 'lang'> = {
  rounds: 3,
  maxPlayers: 8,
  octopusAmount: 1,
  drawingTime: 15,
  useCustomKeyword: false,
  isCustomKeywordVoteOpen: false,
  customKeywordMinVotes: 2,
  isPublic: true,
  isFoolMode: false,
}

export const INCREASE_TIME_AMOUNT = 10
export const DECREASE_TIME_AMOUNT = -10
export const MAX_KEYWORD_LENGTH = 50
