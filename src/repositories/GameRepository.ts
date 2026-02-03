import { GameData } from '../data/GameData'
import { PlayerData } from '../data/PlayerData'
import { RoomData } from '../data/RoomData'
import { Language, Phase, PlayerResponseDTO, Score, Team } from '../data/types'
import keywords from '../domain/keywords'
import { GAME_NOT_FOUND_ERROR, ROUND_INIT_ERROR } from '../errors/game'
import { ROOM_NOT_FOUND_ERROR } from '../errors/room'
import { getNextPhase, getPhaseDuration } from '../lib/game'
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

  updatePhase(gameId: number, nextPhase?: Phase): number {
    const game = this.findById(gameId)
    if (!game) return 0

    const room = roomRepository.findById(game.roomId)
    if (!room) return 0

    game.lastPhaseChange = Date.now()
    game.phase = nextPhase ?? getNextPhase(game)

    const timeLeft = getPhaseDuration(game.phase, room)
    return timeLeft
  }

  initRound(gameId: number, room: RoomData): void {
    const game = this.findById(gameId)
    if (!game) throw ROUND_INIT_ERROR

    // 라운드 초기화
    game.round++

    // 제시어 선정
    const { keyword, fakeWord } = this.getWords(room)
    ;[game.keyword, game.fakeWord] = [keyword, fakeWord]

    // 라이어 선정
    let selectedOctopuses: string[] = []
    while (selectedOctopuses.length < room.settings.octopusAmount) {
      const candidate = room.players[Math.floor(Math.random() * room.players.length)].UUID
      if (!selectedOctopuses.includes(candidate)) {
        selectedOctopuses.push(candidate)
      }
    }
    game.octopuses = selectedOctopuses

    // 투표 초기화
    game.votes = new Map()
    game.didVoteTie = false
    game.topVotedUUID = null

    // 게임 결과 초기화
    game.foundOctopus = false
    game.guessedWord = false
    game.isUnanimity = false
    game.winningTeam = null

    // 그림 초기화
    game.painterId = null
    const canvas = canvasRepository.create({ gameId: game.id })
    game.canvasId = canvas.id

    // 플레이어 초기화
    room.players.forEach(playerRepository.initRound)
  }

  getWords(room: RoomData): { category: string; keyword: string; fakeWord: string } {
    let category: string, keyword: string, fakeWord: string

    if (room.settings.useCustomKeyword && room.customKeywords.size >= 2) {
      // 커스텀 단어 사용
      const customKeywordsArray = Array.from(room.customKeywords)

      const i1 = Math.floor(Math.random() * customKeywordsArray.length)
      keyword = customKeywordsArray[i1][0]

      let i2
      while (i1 === (i2 = Math.floor(Math.random() * customKeywordsArray.length))) {}

      category = 'custom'
      fakeWord = customKeywordsArray[i2][0]
    } else {
      const lang: Language = room.settings.lang
      // 카테고리에 따른 단어 선택
      const categories = Object.keys(keywords)
      category = categories[Math.floor(Math.random() * categories.length)]
      const wordList = keywords[category as keyof typeof keywords][lang]

      const i1 = Math.floor(Math.random() * wordList.length)
      let i2
      while (i1 === (i2 = Math.floor(Math.random() * wordList.length))) {}

      keyword = wordList[i1]
      fakeWord = wordList[i2]
    }

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
    if (player.votedPlayerUUID !== null) return false

    const currentVotes = game.votes.get(targetPlayer.UUID) || 0
    game.votes.set(targetPlayer.UUID, currentVotes + 1)
    player.votedPlayerUUID = targetPlayer.UUID
    return true
  }

  delete(gameId: number): boolean {
    const game = this.findById(gameId)
    if (!game) return false

    if (game.intervalId) {
      clearInterval(game.intervalId)
      game.intervalId = null
    }

    const room = roomRepository.findById(game.roomId)
    if (room) room.game = null

    this.records.delete(gameId)
    return true
  }

  calculateScores(gameId: number) {
    const game = this.findById(gameId)
    if (!game) throw GAME_NOT_FOUND_ERROR

    const room = roomRepository.findById(game.roomId)
    if (!room) throw ROOM_NOT_FOUND_ERROR

    room.players.forEach((player) => {
      let delta = 0

      if (game.octopuses.includes(player.UUID)) {
        // 문어
        if (game.winningTeam === Team.OCTOPUS) {
          // 문어 승리
          delta = 20 - (game.votes.get(player.UUID) || 0)
        } else {
          // 문어 패배
          if (game.isUnanimity && game.topVotedUUID === player.UUID) {
            // 만장일치로 패배
            delta = -10
          }
        }
      } else {
        // 오징어
        if (game.winningTeam === Team.SQUID) {
          // 오징어 승리
          delta = 5
          if (game.isUnanimity) {
            // 만장일치
            delta += 20
          } else {
            // 문어 맞춘 플레이어에게 +5
            if (game.octopuses.includes(player.votedPlayerUUID || '')) delta += 5
          }
        }
      }

      const total = (game.scores.get(player.UUID)?.total || 0) + delta

      game.scores.set(player.UUID, { total, delta })
    })

    return game.scores
  }

  getRanks(gameId: number): { player: PlayerResponseDTO; score: Score }[] {
    const game = this.findById(gameId)
    if (!game) return []

    return Array.from(game.scores.entries())
      .map(([UUID, score]) => {
        const player = playerRepository.findByUUID(UUID)
        if (!player) return null
        return {
          player: playerRepository.getResponseDTO(player.id),
          score,
        }
      })
      .filter((entry): entry is { player: any; score: any } => entry !== null)
      .sort((a, b) => b.score.total - a.score.total)
  }

  getScores(gameId: number): { UUID: string; score: Score }[] {
    const game = this.findById(gameId)
    if (!game) return []

    return Array.from(game.scores.entries()).map(([UUID, score]) => ({ UUID, score }))
  }

  allPlayersVoted(game: GameData): boolean {
    const room = roomRepository.findById(game.roomId)
    if (!room) throw ROOM_NOT_FOUND_ERROR

    return room.players.every((player) => player.votedPlayerUUID !== null)
  }
}

const gameRepository = new GameRepository('games')

export { gameRepository }
