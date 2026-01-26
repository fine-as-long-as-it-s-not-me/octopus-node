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

export const PHASE_INTERVALS: Record<Phase, number> = {
  init: 0,
  drawing: 12 * 30,
  keyword: 10,
  discussion: 30,
  voting: 15,
  voteResult: 10,
  guessing: 20,
  score: 15,
  result: 10,
}

export const SYSTEM = {
  id: 0,
  UUID: 'system',
  name: 'System',
}
