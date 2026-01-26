import { GameData } from '../data/GameData'
import { RoomData } from '../data/RoomData'
import { Language } from '../data/types'
import keywords from '../domain/keywords'
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

    // 라운드 초기화
    game.round++
    const { keyword, fakeWord } = this.getWords(room.lang)
    ;[game.keyword, game.fakeWord] = [keyword, fakeWord]

    game.liars = [room.players[0].id] // 예시로 고정된 키워드 사용
    game.painterId = null

    const canvas = canvasRepository.create({ gameId: game.id })
    game.canvasId = canvas.id
    console.log('game initialized: canvasId ', game.canvasId)
  }

  getWords(lang: Language): { category: string; keyword: string; fakeWord: string } {
    // 카테고리에 따른 단어 선택
    const categories = Object.keys(keywords)
    const category = categories[Math.floor(Math.random() * categories.length)]
    const wordList = keywords[category as keyof typeof keywords][lang]

    console.log(categories, category, lang)
    console.log('wordList:', wordList)

    const i1 = Math.floor(Math.random() * wordList.length)
    let i2
    while (i1 === (i2 = Math.floor(Math.random() * wordList.length))) {}

    const keyword = wordList[i1]
    const fakeWord = wordList[i2]

    return {
      category,
      keyword,
      fakeWord,
    }
  }
}

const gameRepository = new GameRepository('games')

export { gameRepository }
