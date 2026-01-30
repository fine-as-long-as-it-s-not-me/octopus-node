import { WebSocket } from 'ws'
import { playerRepository } from '../repositories/PlayerRepository'
import { roomRepository } from '../repositories/RoomRepository'
import { Phase } from '../data/types'
import { gameRepository } from '../repositories/GameRepository'
import { chatService } from './ChatService'

class VoteService {
  vote(socket: WebSocket, targetUUID: string): void {
    const player = playerRepository.findBySocket(socket)
    if (!player || !player.roomId) return

    const room = roomRepository.findById(player.roomId)
    if (!room) return

    const game = room.game
    if (!game) return

    if (game.phase !== Phase.VOTING) return

    const targetPlayer = room.players.find((p) => p.UUID === targetUUID)
    if (!targetPlayer) return

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
