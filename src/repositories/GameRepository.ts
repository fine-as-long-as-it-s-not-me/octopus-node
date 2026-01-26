import { CanvasData } from '../data/CanvasData'
import { GameData } from '../data/GameData'
import { RoomData } from '../data/RoomData'
import { getNextPhase, getPhaseDuration } from '../lib/game'
import { gameService } from '../services/GameService'
import { BaseRepository } from './BaseRepository'
import { canvasRepository } from './CanvasRepository'
import { roomRepository } from './RoomRepository'

class GameRepository extends BaseRepository<GameData> {
  create(room: RoomData): GameData {
    const game: GameData = new GameData(room)
    this.records.set(game.id, game)

    roomRepository.update(room.id, { ...room, game: game })

    game.intervalId = setInterval(() => {
      gameRepository.tick(game.id)
    }, 1000)
    return game
  }

  tick(gameId: number): void {
    const game = this.findById(gameId)
    if (!game) return

    const room = roomRepository.findById(game.roomId)
    if (!room) return

    // 게임 타이머 관련 로직
    const now = Date.now()
    const elapsed = Math.floor((now - game.lastPhaseChange) / 1000)
    const phaseDuration = getPhaseDuration(game, room)
    let timeLeft = phaseDuration - elapsed

    if (timeLeft < 0) {
      game.lastPhaseChange = now
      const nextPhase = getNextPhase(game.phase)
      game.phase = nextPhase
      timeLeft = getPhaseDuration(game, room)
      gameService.phaseHandlers[game.phase](game, timeLeft)
    }

    gameService.tick(game.id, timeLeft)
  }

  initRound(gameId: number, room: RoomData): void {
    const game = this.findById(gameId)
    if (!game) return

    // 라운드 초기화 로직
    game.round++
    const { keyword, fakeWord } = this.getWords('exampleCategory')

    ;[game.keyword, game.fakeWord] = [keyword, fakeWord]

    game.liars = [room.players[0].id] // 예시로 고정된 키워드 사용
    game.painterId = null

    const canvas = canvasRepository.create({ gameId: game.id })
    game.canvasId = canvas.id
    console.log('game initialized: canvasId ', game.canvasId)
  }

  getWords(category: string): { keyword: string; fakeWord: string } {
    // 카테고리에 따른 단어 선택 로직 (예시로 고정된 단어 사용)
    return {
      keyword: 'example',
      fakeWord: 'fake',
    }
  }
}

const gameRepository = new GameRepository('games')

export { gameRepository }
