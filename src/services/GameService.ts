import { WebSocket } from 'ws'
import { playerRepository } from '../repositories/PlayerRepository'
import { roomRepository } from '../repositories/RoomRepository'
import { gameRepository } from '../repositories/GameRepository'
import { Phase, Team } from '../data/types'
import { GameData } from '../data/GameData'
import { roomService } from './RoomService'
import { playerService } from './PlayerService'
import { canvasService } from './CanvasService'
import { canvasRepository } from '../repositories/CanvasRepository'
import { getPhaseDuration } from '../lib/game'
import { normalizeString } from '../lib/string'
import { chatService } from './ChatService'
import {
  GAME_ALREADY_IN_PROGRESS_ERROR,
  GAME_CREATE_FAILED_ERROR,
  GAME_NOT_FOUND_ERROR,
  ONLY_HOST_CAN_START_GAME_ERROR,
} from '../errors/game'
import { PLAYER_NOT_FOUND_ERROR, PLAYER_NOT_IN_ROOM_ERROR } from '../errors/player'
import { ROOM_NOT_FOUND_ERROR } from '../errors/room'

class GameService {
  phaseStarters: Record<Phase, (game: GameData, timeLeft: number) => void> = {
    [Phase.INIT]: () => {},
    [Phase.KEYWORD]: this.startKeywordPhase.bind(this),
    [Phase.DRAWING]: this.startDrawingPhase.bind(this),
    [Phase.DISCUSSION]: this.startDiscussionPhase.bind(this),
    [Phase.VOTING]: this.startVotingPhase.bind(this),
    [Phase.VOTE_RESULT]: this.startVoteResultPhase.bind(this),
    [Phase.GUESSING]: this.startGuessingPhase.bind(this),
    [Phase.ROUND_RESULT]: this.startRoundResultPhase.bind(this),
    [Phase.GAME_RESULT]: this.startGameResultPhase.bind(this),
    [Phase.END]: this.startEndPhase.bind(this),
  }

  startGame(socket: WebSocket): void {
    const player = playerRepository.findBySocket(socket)
    if (!player) throw PLAYER_NOT_FOUND_ERROR
    if (!player.roomId) throw PLAYER_NOT_IN_ROOM_ERROR

    const room = roomRepository.findById(player.roomId)
    if (!room) throw ROOM_NOT_FOUND_ERROR

    if (room.hostId !== player.id) throw ONLY_HOST_CAN_START_GAME_ERROR
    if (room.game) throw GAME_ALREADY_IN_PROGRESS_ERROR

    const game = gameRepository.create(room)
    if (!game) throw GAME_CREATE_FAILED_ERROR

    // broadcast game started message
    roomService.sendMessage(room, 'game_started', {})

    // proceed time ticker
    game.intervalId = setInterval(() => {
      this.tick(game.id)
    }, 1000)
  }

  tick(gameId: number): void {
    const game = gameRepository.findById(gameId)
    if (!game) return

    const room = roomRepository.findById(game.roomId)
    if (!room) return

    const { timeLeft, phase } = this.getTimeLeftPhase(gameId)

    roomService.sendMessage(room, 'tick', {
      round: game.round,
      phase,
      timeLeft,
    })
  }

  getTimeLeftPhase(gameId: number): { timeLeft: number; phase: Phase } {
    const game = gameRepository.findById(gameId)
    if (!game) return { timeLeft: 0, phase: Phase.INIT }

    const room = roomRepository.findById(game.roomId)
    if (!room) return { timeLeft: 0, phase: Phase.INIT }

    const now = Date.now()
    const elapsed = Math.floor((now - game.lastPhaseChange) / 1000)
    const phaseDuration = getPhaseDuration(game.phase, room)
    let timeLeft = phaseDuration - elapsed

    if (timeLeft < 0) {
      timeLeft = gameRepository.updatePhase(gameId)
      this.phaseStarters[game.phase](game, timeLeft)
    }

    if (game.phase === Phase.DRAWING) {
      timeLeft =
        timeLeft > 0
          ? timeLeft % room.settings.drawingTime === 0
            ? room.settings.drawingTime
            : timeLeft % room.settings.drawingTime
          : 0
    }

    return { timeLeft, phase: game.phase }
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

  startKeywordPhase(game: GameData): void {
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

  startDrawingPhase(game: GameData, timeLeft: number): void {
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
        this.startDrawingPhase(game, timeLeft - room.settings.drawingTime)
      }, room.settings.drawingTime * 1000)
  }

  startDiscussionPhase(game: GameData): void {
    // 토론 단계
  }

  startVotingPhase(game: GameData): void {
    // 투표 단계
  }

  startVoteResultPhase(game: GameData): void {
    // 투표 결과 발표 단계
    const room = roomRepository.findById(game.roomId)
    if (!room) return

    const voteResult = game.votes

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
      game.topVotedUUID = votedUUID
      const isOctopus = game.octopuses.includes(votedUUID)
      if (isOctopus) {
        // 라이어를 맞춘 경우
        game.foundOctopus = true
      } else {
        // 라이어를 못 맞춘 경우
        game.foundOctopus = false
        game.winningTeam = Team.SQUID
      }
    } else {
      // 동점인 경우
      if (!game.didVoteTie) {
        // 재투표
        game.didVoteTie = true
        gameRepository.updatePhase(game.id, Phase.VOTING)
        chatService.addSystemChatMessage(room.id, 'revote', {})
        return
      } else {
        // 두 번 동점이면 문어 승리
        game.winningTeam = Team.OCTOPUS
      }
    }

    roomService.sendMessage(room, 'vote_result', {
      voteResult: Array.from(voteResult.entries()),
      votedPlayer: playerRepository.getResponseDTO(
        playerRepository.findByUUID(game.topVotedUUID!)!.id,
      ),
      octopuses: game.octopuses.map((id) => {
        const player = playerRepository.findByUUID(id)
        if (!player) return null
        return playerRepository.getResponseDTO(player.id)
      }),
    })
  }

  startGuessingPhase(game: GameData): void {}

  startRoundResultPhase(game: GameData): void {
    // 점수 집계 단계
    const room = roomRepository.findById(game.roomId)
    if (!room) return

    const scores = gameRepository.calculateScores(game.id)
    if (!scores) return

    const ranks = gameRepository.getRanks(game.id)

    roomService.sendMessage(room, 'round_result', {
      ranks,
      tied: game.didVoteTie,
      guessed: game.guessedWord,
      isUnanimity: game.isUnanimity,
    })
  }

  startGameResultPhase(game: GameData): void {
    // 결과 발표 단계
    const room = roomRepository.findById(game.roomId)
    if (!room) return

    const ranks = gameRepository.getRanks(game.id)

    roomService.sendMessage(room, 'game_result', {
      ranks,
    })
  }

  startEndPhase(game: GameData): void {
    // 게임 종료 단계
    const room = roomRepository.findById(game.roomId)
    if (!room) return

    gameRepository.delete(game.id)
    roomService.sendMessage(room, 'game_ended', {})
  }

  guessWord(socket: WebSocket, word: string): void {
    const player = playerRepository.findBySocket(socket)
    if (!player) throw PLAYER_NOT_FOUND_ERROR
    if (!player.roomId) throw PLAYER_NOT_IN_ROOM_ERROR

    const room = roomRepository.findById(player.roomId)
    if (!room) throw ROOM_NOT_FOUND_ERROR

    const game = room.game
    if (!game) throw GAME_NOT_FOUND_ERROR

    if (game.phase !== Phase.GUESSING) return

    if (!game.octopuses.includes(player.UUID)) return

    const isCorrect = normalizeString(word) === normalizeString(game.keyword)
    game.guessedWord = isCorrect

    chatService.addSystemChatMessage(room.id, 'octopus_guessed', {
      name: player.name,
      word,
    })

    gameRepository.updatePhase(game.id, Phase.ROUND_RESULT)
  }
}

const gameService = new GameService()

export { gameService }
