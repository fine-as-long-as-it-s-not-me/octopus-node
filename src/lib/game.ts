import { GameData } from '../data/GameData'
import { RoomData } from '../data/RoomData'
import { Phase } from '../data/types'

export function getNextPhase(phase: Phase): Phase {
  switch (phase) {
    case Phase.RESULT:
      return Phase.KEYWORD
    case Phase.INIT:
      return Phase.KEYWORD
    case Phase.KEYWORD:
      return Phase.DRAWING
    case Phase.DRAWING:
      return Phase.DISCUSSION
    case Phase.DISCUSSION:
      return Phase.VOTING
    case Phase.VOTING:
      return Phase.VOTE_RESULT
    case Phase.VOTE_RESULT:
      return Phase.GUESSING
    case Phase.GUESSING:
      return Phase.SCORE
    case Phase.SCORE:
      return Phase.RESULT
    default:
      return Phase.RESULT
  }
}

export function getPhaseDuration(game: GameData, room: RoomData): number {
  switch (game.phase) {
    case Phase.KEYWORD:
      return 5
    case Phase.DRAWING:
      return room.players.length * room.settings.drawingTime
    case Phase.DISCUSSION:
      return 30 + game.timeAlpha
    case Phase.VOTING:
      return 20
    case Phase.VOTE_RESULT:
      return 15
    case Phase.GUESSING:
      return 30
    case Phase.SCORE:
      return 15
    case Phase.RESULT:
      return 20
    default:
      return 0
  }
}
