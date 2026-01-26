import { WebSocket } from 'ws'
import { playerRepository } from '../repositories/PlayerRepository'
import { roomRepository } from '../repositories/RoomRepository'
import { gameRepository } from '../repositories/GameRepository'
import { getNextPhase } from '../lib/game'
import { Phase } from '../data/types'
import { GameData } from '../data/GameData'
import { roomService } from './RoomService'
import { playerService } from './PlayerService'

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
    const room = game.room
    roomService.sendMessage(room, 'round_updated', {
      round: game.round,
    })
  }

  tick(gameId: number, timeLeft: number): void {
    const game = gameRepository.findById(gameId)
    if (!game) return

    const room = game.room

    if (game.phase === Phase.DRAWING) timeLeft = timeLeft % room.players.length

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

    gameRepository.create(room) // 예시로 총 5라운드 게임 생성
  }

  getWords(category: string): { keyword: string; fakeWord: string } {
    // 카테고리에 따른 단어 선택 로직 (예시로 고정된 단어 사용)
    return {
      keyword: 'example',
      fakeWord: 'fake',
    }
  }

  initRound(game: GameData): void {
    // 라운드 초기화 로직
    game.round++
    const { keyword, fakeWord } = this.getWords('exampleCategory')

    ;[game.keyword, game.fakeWord] = [keyword, fakeWord]

    game.liars = [game.room.players[0]] // 예시로 고정된 키워드 사용
    game.painter = null

    this.updateRound(game)
  }

  handleKeywordPhase(game: GameData): void {
    // 키워드 표시 단계
    this.initRound(game)

    game.room.players.forEach((player) => {
      const isLiar = game.liars.some((liar) => liar.id === player.id)
      const wordToShow = isLiar ? game.fakeWord : game.keyword

      playerService.sendMessage(player.id, 'keyword', {
        keyword: wordToShow,
      })
    })
  }

  handleDrawingPhase(game: GameData, timeLeft: number): void {
    // 현재 painter UUID 가져오기
    const playerLength = game.room.players.length

    // 현재 라운드와 날짜 활용한 난수 offset
    const offset = (game.round + new Date().getDate()) % playerLength
    const d = Math.floor(timeLeft / game.room.settings.drawingTime)
    const index = (d + offset) % playerLength

    const painter = game.room.players[index]
    game.painter = painter

    roomService.sendMessage(game.room, 'painter', {
      UUID: painter.UUID,
    })
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
