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

  updateRound(game: GameData): void {
    const room = roomRepository.findById(game.roomId)
    if (!room) return

    roomService.sendMessage(room, 'round_updated', {
      round: game.round,
    })
  }

  tick(gameId: number, timeLeft: number): void {
    const game = gameRepository.findById(gameId)
    if (!game) return

    const room = roomRepository.findById(game.roomId)
    if (!room) return

    if (game.phase === Phase.DRAWING) timeLeft = timeLeft % room.settings.drawingTime

    roomService.sendMessage(room, 'tick', {
      round: game.round,
      phase: game.phase,
      timeLeft,
    })
  }

  startGame(socket: WebSocket): void {
    // 게임을 시작하는 로직
    const player = playerRepository.findBySocket(socket)
    if (!player) return
    const roomId = player.roomId
    if (!roomId) return
    const room = roomRepository.findById(roomId)
    if (!room) return
    if (room.host.id !== player.id || room.game) return // 호스트만 게임 시작 가능

    gameRepository.create(room)
  }

  initRound(game: GameData): void {
    const room = roomRepository.findById(game.roomId)
    if (!room) return console.log('Room not found at initRound')

    gameRepository.initRound(game.id, room)
    this.updateRound(game)

    // canvas 초기화
    if (!game.canvasId) return
    const canvas = canvasRepository.findById(game.canvasId)
    if (!canvas) return
    canvasService.updateCanvas(room, canvas)
  }

  handleKeywordPhase(game: GameData): void {
    // 키워드 표시 단계
    this.initRound(game)

    const room = roomRepository.findById(game.roomId)
    if (!room) return

    room.players.forEach((player) => {
      const isLiar = game.liars.some((liarId) => liarId === player.id)
      const wordToShow = isLiar ? game.fakeWord : game.keyword

      playerService.sendMessage(player.id, 'keyword', {
        keyword: wordToShow,
      })
    })
  }

  handleDrawingPhase(game: GameData, timeLeft: number): void {
    const room = roomRepository.findById(game.roomId)
    if (!room) return

    console.log(timeLeft)

    // 현재 painter UUID 가져오기
    const playerLength = room.players.length

    // 현재 라운드와 날짜 활용한 난수 offset
    const offset = (game.round + new Date().getDate()) % playerLength
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
}

const gameService = new GameService()

export { gameService }
