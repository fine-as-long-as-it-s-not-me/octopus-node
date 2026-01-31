import { MainTypeHandlerMap } from './types'

import { voteHandlers } from './handlers/VoteHandler'
import { discussionHandlers } from './handlers/DiscussionHandler'
import { kickHandlers } from './handlers/KickHandler'
import { drawHandlers } from './handlers/DrawHandler'
import { chatHandlers } from './handlers/ChatHandler'
import { gameHandlers } from './handlers/GameHandler'
import { roomHandlers } from './handlers/RoomHandler'
import { playerHandlers } from './handlers/PlayerHandler'
import { errorHandlers } from './errorHandler'

export const handlers: MainTypeHandlerMap = {
  vote: voteHandlers,
  discussion: discussionHandlers,
  kick: kickHandlers,
  draw: drawHandlers,
  chat: chatHandlers,
  game: gameHandlers,
  room: roomHandlers,
  player: playerHandlers,
}

export { errorHandlers }
