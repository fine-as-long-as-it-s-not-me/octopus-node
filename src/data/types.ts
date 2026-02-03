import { PlayerData } from './PlayerData'

export interface Chat {
  player: PlayerData
  message: string
  timestamp: number
}

export type Language = 'en' | 'ko'

export interface Settings {
  rounds: number
  maxPlayers: number
  octopusAmount: number
  drawingTime: number
  useCustomKeyword: boolean
  isCustomKeywordVoteOpen: boolean
  customKeywordMinVotes: number
  isPublic: boolean
  lang: Language
  isFoolMode: boolean
}

export type ChangeableSettings = Omit<Settings, 'lang' | 'octopusAmount'>

export interface Stroke {
  id: string
  sequence: number
  color: string
  tool: ToolType
  strokeWidth: number
  points: { x: number; y: number }[]
}

export type ToolType = 'pen' | 'eraser'
export enum Phase {
  INIT = 'init',
  KEYWORD = 'keyword',
  DRAWING = 'drawing',
  DISCUSSION = 'discussion',
  VOTING = 'voting',
  VOTE_RESULT = 'vote-result',
  GUESSING = 'guessing',
  ROUND_RESULT = 'round-result',
  GAME_RESULT = 'game-result',
  END = 'end',
}

export enum Team {
  OCTOPUS = 'octopus',
  SQUID = 'squid',
}

export type Score = { total: number; delta: number }

export type PlayerResponseDTO = {
  id: number
  UUID: string
  name: string
  roomCode: string | null
}
