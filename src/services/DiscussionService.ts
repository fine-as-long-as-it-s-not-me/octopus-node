import { WebSocket } from 'ws'
import { playerRepository } from '../repositories/PlayerRepository'
import { roomRepository } from '../repositories/RoomRepository'
import { Phase } from '../data/types'
import { playerService } from './PlayerService'
import { gameRepository } from '../repositories/GameRepository'
import { chatService } from './ChatService'
import { gameService } from './GameService'
import { GAME_NOT_FOUND_ERROR } from '../errors/game'
import { PLAYER_NOT_FOUND_ERROR, PLAYER_NOT_IN_ROOM_ERROR } from '../errors/player'
import { ROOM_NOT_FOUND_ERROR } from '../errors/room'

class DiscussionService {
  changeDiscussionTime(socket: WebSocket, amount: number): void {
    const player = playerRepository.findBySocket(socket)
    if (!player) throw PLAYER_NOT_FOUND_ERROR
    const roomId = player.roomId
    if (!roomId) throw PLAYER_NOT_IN_ROOM_ERROR
    const room = roomRepository.findById(roomId)
    if (!room) throw ROOM_NOT_FOUND_ERROR
    const game = room.game
    if (!game) throw GAME_NOT_FOUND_ERROR

    if (game.phase !== Phase.DISCUSSION) return

    if (amount > 0 && player.hasIncreasedDiscussionTime)
      return playerService.sendMessage(player.id, 'error', {
        message: 'You have already extended the discussion time.',
      })
    if (amount < 0 && player.hasDecreasedDiscussionTime)
      return playerService.sendMessage(player.id, 'error', {
        message: 'You have already shortened the discussion time.',
      })

    const res = gameRepository.changeDiscussionTime(player, game.id, amount)
    if (!res) return

    chatService.addSystemChatMessage(room.id, 'discussion_time_changed', {
      amount,
      name: player.name,
    })

    gameService.tick(game.id) // 즉시 반영
  }
}

const discussionService = new DiscussionService()

export { discussionService }
