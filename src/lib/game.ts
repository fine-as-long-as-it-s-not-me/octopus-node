import { GameData } from '../data/GameData'
import { RoomData } from '../data/RoomData'
import { Phase } from '../data/types'

export function getNextPhase(game: GameData): Phase {
  switch (game.phase) {
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
      return game.round === game.totalRounds ? Phase.RESULT : Phase.KEYWORD
    case Phase.RESULT:
      return Phase.END
    default:
      return Phase.END
  }
}

export function getPhaseDuration(phase: Phase, room: RoomData): number {
  switch (phase) {
    case Phase.INIT:
      return 0
    case Phase.KEYWORD:
      return 5
    case Phase.DRAWING:
      return room.players.length * room.settings.drawingTime
    case Phase.DISCUSSION:
      return 30
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
    case Phase.END:
      return 0
    default:
      return 0
  }
}
