import { GameData } from '../data/GameData'
import { BaseRepository } from './BaseRepository'

class GameRepository extends BaseRepository<GameData> {}

const gameRepository = new GameRepository('games')

export { gameRepository }
