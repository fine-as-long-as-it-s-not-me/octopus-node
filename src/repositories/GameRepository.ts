import { GameData } from '../data/GameData'
import { RoomData } from '../data/RoomData'
import { getNextPhase, getPhaseDuration } from '../lib/game'
import { gameService } from '../services/GameService'
import { BaseRepository } from './BaseRepository'
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

    // 게임 타이머 관련 로직
    const now = Date.now()
    const elapsed = Math.floor((now - game.lastPhaseChange) / 1000)
    const phaseDuration = getPhaseDuration(game)
    let timeLeft = phaseDuration - elapsed

    if (timeLeft < 0) {
      game.lastPhaseChange = now
      const nextPhase = getNextPhase(game.phase)
      game.phase = nextPhase
      gameService.phaseHandlers[game.phase](game, timeLeft)
      timeLeft = getPhaseDuration(game)
    }

    gameService.tick(game.id, timeLeft)
  }
}

const gameRepository = new GameRepository('games')

export { gameRepository }
