import { GameData } from '../data/GameData'
import { PlayerData } from '../data/PlayerData'
import { RoomData } from '../data/RoomData'
import { Language, Phase } from '../data/types'
import keywords from '../domain/keywords'
import { getNextPhase, getPhaseDuration } from '../lib/game'
import { gameService } from '../services/GameService'
import { BaseRepository } from './BaseRepository'
import { canvasRepository } from './CanvasRepository'
import { playerRepository } from './PlayerRepository'
import { roomRepository } from './RoomRepository'

class GameRepository extends BaseRepository<GameData> {
  create(room: RoomData): GameData {
    const game: GameData = new GameData(room)
    this.records.set(game.id, game)

    roomRepository.update(room.id, { ...room, game: game })

    return game
  }

  getPhaseLeftTime(gameId: number): number {
    const game = this.findById(gameId)
    if (!game) return 0

    const room = roomRepository.findById(game.roomId)
    if (!room) return 0

    // 게임 타이머 관련 로직
    const now = Date.now()
    const elapsed = Math.floor((now - game.lastPhaseChange) / 1000)
    const phaseDuration = getPhaseDuration(game, room)
    let timeLeft = phaseDuration - elapsed

    if (timeLeft < 0) {
      // update phase
      game.lastPhaseChange = now
      const nextPhase = getNextPhase(game.phase)
      game.phase = nextPhase
      timeLeft = getPhaseDuration(game, room)
      gameService.phaseHandlers[game.phase](game, timeLeft)
    }

    if (game.phase === Phase.DRAWING) timeLeft %= room.settings.drawingTime

    return timeLeft
  }

  initRound(gameId: number, room: RoomData): void {
    const game = this.findById(gameId)
    if (!game) return

    // 라운드 초기화
    game.round++

    // 제시어
    const { keyword, fakeWord } = this.getWords(room.lang)
    ;[game.keyword, game.fakeWord] = [keyword, fakeWord]

    // 라이어
    game.liars = [room.players[0].id] // 예시로 고정된 라이어

    // 투표
    game.votes = new Map()

    // 그림
    game.painterId = null
    const canvas = canvasRepository.create({ gameId: game.id })
    game.canvasId = canvas.id

    // 플레이어 초기화
    room.players.forEach(playerRepository.initRound)
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

  changeDiscussionTime(player: PlayerData, gameId: number, amount: number): boolean {
    const game = this.findById(gameId)
    if (!game) return false

    const room = roomRepository.findById(game.roomId)
    if (!room) return false

    if (amount > 0) player.hasIncreasedDiscussionTime = true
    if (amount < 0) player.hasDecreasedDiscussionTime = true

    game.lastPhaseChange += amount * 1000
    return true
  }

  vote(game: GameData, player: PlayerData, targetPlayer: PlayerData): boolean {
    if (game.phase !== Phase.VOTING) return false
    if (player.voted) return false
    const currentVotes = game.votes.get(targetPlayer.id) || 0
    game.votes.set(targetPlayer.id, currentVotes + 1)
    player.voted = true
    return true
  }

  getVoteResult(game: GameData): Map<string, number> {
    const res = new Map<string, number>()
    game.votes.forEach((count, playerId) => {
      const player = playerRepository.findById(playerId)
      if (!player) return
      res.set(player.UUID, count)
    })
    return res
  }
}

const gameRepository = new GameRepository('games')

export { gameRepository }
