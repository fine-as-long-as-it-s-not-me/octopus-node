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
import { getPhaseDuration } from '../lib/game'
import { normalizeString } from '../lib/string'

class GameService {
  phaseStarters: Record<Phase, (game: GameData, timeLeft: number) => void> = {
    [Phase.INIT]: () => {},
    [Phase.KEYWORD]: this.startKeywordPhase.bind(this),
    [Phase.DRAWING]: this.startDrawingPhase.bind(this),
    [Phase.DISCUSSION]: this.startDiscussionPhase.bind(this),
    [Phase.VOTING]: this.startVotingPhase.bind(this),
    [Phase.VOTE_RESULT]: this.startVoteResultPhase.bind(this),
    [Phase.GUESSING]: this.startGuessingPhase.bind(this),
    [Phase.SCORE]: this.startRoundResultPhase.bind(this),
    [Phase.RESULT]: this.startGameResultPhase.bind(this),
    [Phase.END]: this.startEndPhase.bind(this),
  }

  startGame(socket: WebSocket): void {
    const player = playerRepository.findBySocket(socket)
    if (!player || !player.roomId) return

    const room = roomRepository.findById(player.roomId)
    if (!room) return

    if (room.host.id !== player.id) return
    if (room.game) return

    const game = gameRepository.create(room)
    if (!game) return

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
      const isOctopus = game.octopuses.includes(votedUUID)
      if (isOctopus) {
        // 라이어를 맞춘 경우
        game.foundOctopus = true
      } else {
        // 라이어를 못 맞춘 경우
        game.foundOctopus = false
        game.winningTeam = 'OCTOPUS'
      }
    } else {
      // 동점인 경우
      if (!game.didVoteTie) {
        // 재투표
        game.didVoteTie = true
        gameRepository.updatePhase(game.id, Phase.VOTING)
        roomService.addSystemChatMessage(room.id, 'revote', {})
        return
      } else {
        // 두 번 동점이면 문어 승리
        game.winningTeam = 'OCTOPUS'
      }
    }

    roomService.sendMessage(room, 'vote_result', {
      topVotes,
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

    const scores = gameRepository.getScores(game.id)
    roomService.sendMessage(room, 'round_result', {
      scores,
      tied: game.didVoteTie,
      guessed: game.guessedWord,
      octopuses: game.octopuses.map((id) => {
        const player = playerRepository.findByUUID(id)
        if (!player) return null
        return playerRepository.getResponseDTO(player.id)
      }),
    })
  }

  startGameResultPhase(game: GameData): void {
    // 결과 발표 단계
    const room = roomRepository.findById(game.roomId)
    if (!room) return

    const scores = gameRepository.getScores(game.id)
    roomService.sendMessage(room, 'game_result', {
      scores,
    })
  }

  startEndPhase(game: GameData): void {
    // 게임 종료 단계
    const room = roomRepository.findById(game.roomId)
    if (!room) return

    gameRepository.delete(game.id)
    roomService.sendMessage(room, 'game_ended', {})
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

  guessWord(socket: WebSocket, word: string): void {
    const player = playerRepository.findBySocket(socket)
    if (!player) return
    const roomId = player.roomId
    if (!roomId) return
    const room = roomRepository.findById(roomId)
    if (!room) return
    const game = room.game
    if (!game) return

    if (game.phase !== Phase.GUESSING) return

    if (!game.octopuses.includes(player.UUID)) return

    const isCorrect = normalizeString(word) === normalizeString(game.keyword)
    game.guessedWord = isCorrect
  }
}

const gameService = new GameService()

export { gameService }
