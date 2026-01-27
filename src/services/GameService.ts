import { WebSocket } from 'ws'
import { playerRepository } from '../repositories/PlayerRepository'
import { roomRepository } from '../repositories/RoomRepository'
import { gameRepository } from '../repositories/GameRepository'
import { Phase } from '../data/types'
import { GameData } from '../data/GameData'
import { roomService } from './RoomService'
import { playerService } from './PlayerService'
import { canvasService } from './CanvasService'
import { canvasRepository } from '../repositories/CanvasRepository'

class GameService {
  phaseHandlers: Record<Phase, (game: GameData, timeLeft: number) => void> = {
    [Phase.INIT]: () => {},
    [Phase.KEYWORD]: this.handleKeywordPhase.bind(this),
    [Phase.DRAWING]: this.handleDrawingPhase.bind(this),
    [Phase.DISCUSSION]: this.handleDiscussionPhase.bind(this),
    [Phase.VOTING]: this.handleVotingPhase.bind(this),
    [Phase.VOTE_RESULT]: this.handleVoteResultPhase.bind(this),
    [Phase.GUESSING]: this.handleGuessingPhase.bind(this),
    [Phase.SCORE]: this.handleScorePhase.bind(this),
    [Phase.RESULT]: this.handleResultPhase.bind(this),
  }

  startGame(socket: WebSocket): void {
    // 게임을 시작하는 로직
    const player = playerRepository.findBySocket(socket)
    if (!player || !player.roomId) return

    const room = roomRepository.findById(player.roomId)
    if (!room) return

    if (room.host.id !== player.id) return
    if (room.game) return

    const game = gameRepository.create(room)
    if (!game) return
    game.intervalId = setInterval(() => {
      gameService.tick(game.id)
    }, 1000)
  }

  tick(gameId: number): void {
    const game = gameRepository.findById(gameId)
    if (!game) return

    const room = roomRepository.findById(game.roomId)
    if (!room) return

    let timeLeft = gameRepository.getPhaseLeftTime(gameId)
    if (timeLeft < 0) gameRepository.updatePhase(gameId)

    roomService.sendMessage(room, 'tick', {
      round: game.round,
      phase: game.phase,
      timeLeft,
    })
  }

  initRound(game: GameData): void {
    const room = roomRepository.findById(game.roomId)
    if (!room) return console.log('Room not found at initRound')

    gameRepository.initRound(game.id, room)

    // canvas 초기화
    if (!game.canvasId) return
    const canvas = canvasRepository.findById(game.canvasId)
    if (!canvas) return
    canvasService.updateCanvas(room, canvas)

    roomService.sendMessage(room, 'round_updated', {
      round: game.round,
    })
  }

  handleKeywordPhase(game: GameData): void {
    // 키워드 표시 단계
    this.initRound(game)

    const room = roomRepository.findById(game.roomId)
    if (!room) return

    room.players.forEach((player) => {
      const isOctopus = game.octopuses.some((octopusUUID) => octopusUUID === player.UUID)
      const wordToShow = isOctopus ? game.fakeWord : game.keyword

      playerService.sendMessage(player.id, 'keyword', {
        keyword: wordToShow,
      })
    })
  }

  handleDrawingPhase(game: GameData, timeLeft: number): void {
    const room = roomRepository.findById(game.roomId)
    if (!room) return

    // 현재 painter UUID 가져오기
    const playerLength = room.players.length
    const offset = game.lastPhaseChange % playerLength
    const d = Math.floor(timeLeft / room.settings.drawingTime)
    const index = (d + offset) % playerLength

    const painter = room.players[index]
    game.painterId = painter.id

    const isLastPainter = timeLeft <= room.settings.drawingTime

    roomService.sendMessage(room, 'painter', {
      UUID: painter.UUID,
      nextUUID: isLastPainter ? null : room.players[(index + 1) % playerLength].UUID,
    })

    if (!isLastPainter)
      setTimeout(() => {
        this.handleDrawingPhase(game, timeLeft - room.settings.drawingTime)
      }, room.settings.drawingTime * 1000)
  }

  handleDiscussionPhase(game: GameData): void {
    // 토론 단계
  }

  handleVotingPhase(game: GameData): void {
    // 투표 단계
  }

  handleVoteResultPhase(game: GameData): void {
    // 투표 결과 발표 단계
    const room = roomRepository.findById(game.roomId)
    if (!room) return

    const voteResult = gameRepository.getVoteResult(game)

    let topVotes: string[] = []
    let topVote = 0
    for (const [UUID, count] of voteResult.entries()) {
      if (count > topVote) {
        topVote = count
        topVotes = [UUID]
      } else if (count === topVote) {
        topVotes.push(UUID)
      }
    }

    if (topVotes.length === 1) {
      const votedUUID = topVotes[0]
      const isOctopus = game.octopuses.includes(votedUUID)
      if (isOctopus) {
        // 라이어를 맞춘 경우
      } else {
        // 라이어를 못 맞춘 경우
      }
    } else {
      // 동점인 경우
      if (game.didVoteTie) {
        // 라이어 승리
      } else {
        // 재투표
      }
    }

    roomService.sendMessage(room, 'vote_result', {
      voteResult,
      octopuses: game.octopuses.map((id) => {
        const player = playerRepository.findByUUID(id)
        if (!player) return null
        return playerRepository.getResponseDTO(player.id)
      }),
    })
  }

  handleGuessingPhase(game: GameData): void {
    // 라이어의 제시어 추측 단계
  }

  handleScorePhase(game: GameData): void {
    // 점수 집계 단계
  }

  handleResultPhase(game: GameData): void {
    // 결과 발표 단계
  }

  changeDiscussionTime(socket: WebSocket, amount: number): void {
    const player = playerRepository.findBySocket(socket)
    if (!player) return
    const roomId = player.roomId
    if (!roomId) return
    const room = roomRepository.findById(roomId)
    if (!room) return
    const game = room.game
    if (!game) return

    if (game.phase !== Phase.DISCUSSION) return

    if (amount > 0 && player.hasIncreasedDiscussionTime) return
    if (amount < 0 && player.hasDecreasedDiscussionTime) return

    const res = gameRepository.changeDiscussionTime(player, game.id, amount)
    if (!res) return

    roomService.addSystemChatMessage(room.id, 'discussion_time_changed', {
      amount,
      name: player.name,
    })

    this.tick(game.id)
  }

  vote(socket: WebSocket, targetUUID: string): void {
    const player = playerRepository.findBySocket(socket)
    if (!player) return
    const roomId = player.roomId
    if (!roomId) return
    const room = roomRepository.findById(roomId)
    if (!room) return
    const game = room.game
    if (!game) return

    if (game.phase !== Phase.VOTING) return

    const targetPlayer = room.players.find((p) => p.UUID === targetUUID)
    if (!targetPlayer) return

    const res = gameRepository.vote(game, player, targetPlayer)
    if (!res) return

    // 투표 처리 로직 (예: 투표 집계)
    roomService.addSystemChatMessage(room.id, 'player_voted', {
      voterName: player.name,
    })
  }
}

const gameService = new GameService()

export { gameService }
