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

  updatePhase(gameId: number): boolean {
    const game = this.findById(gameId)
    if (!game) return false

    const room = roomRepository.findById(game.roomId)
    if (!room) return false

    game.lastPhaseChange = Date.now()
    game.phase = getNextPhase(game.phase)

    const timeLeft = getPhaseDuration(game, room)
    gameService.phaseHandlers[game.phase](game, timeLeft)
    return true
  }

  initRound(gameId: number, room: RoomData): void {
    const game = this.findById(gameId)
    if (!game) return

    // 라운드 초기화
    game.round++

    // 제시어 선정
    const { keyword, fakeWord } = this.getWords(room.lang)
    ;[game.keyword, game.fakeWord] = [keyword, fakeWord]

    // 라이어 선정
    let selectedOctopuses: string[] = []
    while (selectedOctopuses.length < room.settings.liars) {
      const candidate = room.players[Math.floor(Math.random() * room.players.length)].UUID
      if (!selectedOctopuses.includes(candidate)) {
        selectedOctopuses.push(candidate)
      }
    }
    game.octopuses = selectedOctopuses

    // 투표 초기화
    game.votes = new Map()

    // 그림 초기화
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
    const currentVotes = game.votes.get(targetPlayer.UUID) || 0
    game.votes.set(targetPlayer.UUID, currentVotes + 1)
    player.voted = true
    return true
  }

  getVoteResult(game: GameData): Map<string, number> {
    return game.votes
  }

  delete(gameId: number): boolean {
    const game = this.findById(gameId)
    if (!game) return false

    const room = roomRepository.findById(game.roomId)
    if (room) room.game = null

    this.records.delete(gameId)
    return true
  }
}

const gameRepository = new GameRepository('games')

export { gameRepository }
