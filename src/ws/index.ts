import { MainTypeHandlerMap } from './types'

import { voteHandlers } from './handlers/VoteHandler'
import { discussionHandlers } from './handlers/DiscussionHandler'
import { kickHandlers } from './handlers/KickHandler'
import { guessHandlers } from './handlers/GuessHandler'
import { drawHandlers } from './handlers/DrawHandler'
import { chatHandlers } from './handlers/ChatHandler'
import { gameHandlers } from './handlers/GameHandler'
import { roomHandlers } from './handlers/RoomHandler'
import { playerHandlers } from './handlers/PlayerHandler'

export const handlers: MainTypeHandlerMap = {
  vote: voteHandlers,
  discussion: discussionHandlers,
  kick: kickHandlers,
  guess: guessHandlers,
  draw: drawHandlers,
  chat: chatHandlers,
  game: gameHandlers,
  room: roomHandlers,
  player: playerHandlers,
}
