import { PlayerData } from './PlayerData'

export interface Chat {
  player: PlayerData
  message: string
  timestamp: number
}

export type Languages = 'en' | 'ko'

export interface Settings {
  rounds: number
  maxPlayers: number
  liars: number
  drawingTime: number
  useCustomWord: boolean
  isCustomWordVoteOpen: boolean
  customWordMinVotes: number
  isPublic: boolean
  language: Languages
}

export interface Stroke {
  id: string
  sequence: number
  color: string
  tool: ToolType
  strokeWidth: number
  points: { x: number; y: number }[]
}

export type ToolType = 'pen' | 'eraser'
export type GamePhaseType =
  | 'pending'
  | 'keyword'
  | 'drawing'
  | 'discussion'
  | 'voting'
  | 'voteResult'
  | 'guessing'
  | 'result'
