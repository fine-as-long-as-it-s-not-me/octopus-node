import { Player } from './player'

export type GamePhaseType =
  | 'pending'
  | 'keyword'
  | 'drawing'
  | 'discussion'
  | 'voting'
  | 'voteResult'
  | 'guessing'
  | 'result'

export interface Chat {
  player: Player
  message: string
  timestamp: number
}
