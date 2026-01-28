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
  useCustomWord: boolean
  isCustomWordVoteOpen: boolean
  customWordMinVotes: number
  isPublic: boolean
  lang: Language
}

export type ChangeableSettings = Omit<
  Settings,
  'lang' | 'isCustomWordVoteOpen' | 'customWordMinVotes' | 'octopusAmount'
>

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
  SCORE = 'score',
  RESULT = 'result',
  END = 'end',
}

export type Team = 'OCTOPUS' | 'PLAYERS'

export type Score = { total: number; delta: number }
