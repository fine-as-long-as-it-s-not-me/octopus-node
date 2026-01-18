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
  static rooms = new Map<string, Room>()
  static nextCode = 1000

  code: string
  setting: Setting
  players: Player[] = []
  keywords = new Map<string, number>()
  chats: Chat[] = []
  host: Player
  game?: Game

  static createRoom(host: Player, roomCode?: string, setting = DEFAULT_SETTING): Room {
    let room: Room
    if (roomCode) {
      if (Room.rooms.has(roomCode)) {
        throw new Error('Room code already exists')
      }
      room = new Room(host, roomCode, setting)
    } else {
      let autoRoomCode = Room.nextCode.toString()
      while (Room.rooms.has(autoRoomCode)) {
        Room.nextCode += 1
        autoRoomCode = Room.nextCode.toString()
      }
      room = new Room(host, autoRoomCode, setting)
    }

    Room.rooms.set(room.code, room)
    return room
  }

  constructor(host: Player, roomCode: string, setting: Setting) {
    this.code = roomCode
    this.host = host
    this.setting = setting
    this.players.push(host)
    this.sendWelcomeMessage(host)
    this.updatePlayers()
  }

  static getRoomByCode(roomCode: string): Room | undefined {
    return Room.rooms.get(roomCode)
  }

  // 플레이어 목록 업데이트
  updatePlayers(): void {
    this.players.forEach((player) => {
      sendMessage(player.socket, 'players_updated', {
        hostId: this.host.id,
        players: this.players.map((p) => p.getPublic()),
      })
    })
  }

  // 플레이어 추가
  addPlayer(player: Player): void {
    this.players.push(player)
    this.sendWelcomeMessage(player)
    this.updatePlayers()
  }

  // 플레이어 제거
  removePlayer(player?: Player): void {
    if (!player) return
    this.players = this.players.filter((p) => p.id !== player.id)
    if (this.players.length === 0) {
      Room.rooms.delete(this.code)
    } else {
      if (this.host.id === player.id) this.host = this.players[0]
      this.updatePlayers()
    }
  }

  sendWelcomeMessage(player: Player): void {
    sendMessage(player.socket, 'welcome', { userId: player.id, roomCode: this.code })
  }
}

export { Room }
