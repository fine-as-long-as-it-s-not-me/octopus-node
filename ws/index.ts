import { MainTypeHandlerMap } from './types'

import { voteHandlers } from './handlers/vote'
import { discussionHandlers } from './handlers/discussion'
import { kickHandlers } from './handlers/kick'
import { guessHandlers } from './handlers/guess'
import { drawHandlers } from './handlers/draw'
import { chatHandlers } from './handlers/chat'
import { gameHandlers } from './handlers/game'
import { roomHandlers } from './handlers/room'

export const handlers: MainTypeHandlerMap = {
  vote: voteHandlers,
  discussion: discussionHandlers,
  kick: kickHandlers,
  guess: guessHandlers,
  draw: drawHandlers,
  chat: chatHandlers,
  game: gameHandlers,
  room: roomHandlers
}
