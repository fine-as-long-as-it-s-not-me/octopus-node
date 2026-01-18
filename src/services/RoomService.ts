import { sendMessage, sendRoomMessage } from '../utils/message'
import { Game } from './GameService'
import { Player } from './PlayerService'
import { Chat, Setting } from './types'

const MAX_PLAYERS = 12
const DEFAULT_SETTING: Setting = {
  rounds: 3,
  maxPlayers: 8,
  liars: 1,
  drawingTime: 15,
  customWords: false,
  roomType: 'public',
}

class Room {
  static nextCode = 1000

  code: string
  setting: Setting
  players = new Set<Player>()
  keywords = new Map<string, number>()
  chats: Chat[] = []
  host: Player
  game?: Game

  static rooms = new Map<string, Room>()

  static createRoom(host: Player, setting: Setting = DEFAULT_SETTING): Room {
    const room = new Room(host, setting)
    Room.rooms.set(room.code, room)
    return room
  }

  constructor(host: Player, setting: Setting) {
    this.code = (Room.nextCode++).toString()
    this.host = host
    this.setting = setting
  }

  static getRoomByCode(roomCode: string): Room | undefined {
    return Room.rooms.get(roomCode)
  }

  // 플레이어 목록 업데이트
  updatePlayers(): void {
    this.players.forEach((player) => {
      sendMessage(player.socket, 'players_updated', {
        hostId: this.host.id,
        players: Array.from(this.players).map((p) => p.getPublic()),
      })
    })
  }

  // 플레이어 추가
  addPlayer(player: Player): void {
    this.players.add(player)
    this.updatePlayers()
  }
}

export { Room }
