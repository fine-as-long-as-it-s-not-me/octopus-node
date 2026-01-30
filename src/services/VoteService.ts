import { WebSocket } from 'ws'
import { playerRepository } from '../repositories/PlayerRepository'
import { roomRepository } from '../repositories/RoomRepository'
import { Phase } from '../data/types'
import { gameRepository } from '../repositories/GameRepository'
import { chatService } from './ChatService'
import { GAME_NOT_FOUND_ERROR } from '../errors/game'
import { PLAYER_NOT_FOUND_ERROR, PLAYER_NOT_IN_ROOM_ERROR } from '../errors/player'
import { ROOM_NOT_FOUND_ERROR } from '../errors/room'

class VoteService {
  vote(socket: WebSocket, targetUUID: string): void {
    const player = playerRepository.findBySocket(socket)
    if (!player) throw PLAYER_NOT_FOUND_ERROR
    if (!player.roomId) throw PLAYER_NOT_IN_ROOM_ERROR

    const room = roomRepository.findById(player.roomId)
    if (!room) throw ROOM_NOT_FOUND_ERROR

    const game = room.game
    if (!game) throw GAME_NOT_FOUND_ERROR

    if (game.phase !== Phase.VOTING) return

    const targetPlayer = room.players.find((p) => p.UUID === targetUUID)
    if (!targetPlayer) throw PLAYER_NOT_FOUND_ERROR

    const res = gameRepository.vote(game, player, targetPlayer)
    if (!res) return

    // 투표 처리 로직 (예: 투표 집계)
    chatService.addSystemChatMessage(room.id, 'player_voted', {
      voterName: player.name,
    })
  }
}

const voteService = new VoteService()

export { voteService }
