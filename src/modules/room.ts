import { sendRoomMessage } from '../utils/message'
import { Game } from './game'
import { Player } from './player'
import { Chat } from './types'

const MAX_PLAYERS = 12

const system = new Player('system', 'System', {} as WebSocket)

class Room {
  id: string
  settings: Record<string, any>
  players = new Set<Player>()
  keywords = new Map<string, number>()
  chats: Chat[] = []
  game?: Game

  static rooms = new Map<string, Room>()

  static createRoom(id: string, settings: Record<string, any>): Room {
    const room = new Room(id, settings)
    Room.rooms.set(id, room)
    return room
  }

  static getAvailableRoom(): Room | null {
    const availableRooms = Array.from(Room.rooms.values()).filter(
      (room) => room.players.size < MAX_PLAYERS && !room.game
    )
    if (availableRooms.length > 0) {
      return availableRooms[Math.floor(Math.random() * availableRooms.length)]
    }
    return null
  }

  constructor(id: string, settings: Record<string, any>) {
    this.id = id
    this.settings = settings
  }

  updatePlayers(roomId: string, players: Set<Player>): void {
    // 플레이어 목록을 업데이트하는 로직
  }

  updateRoomSettings(roomId: string, settings: Record<string, any>): void {
    // 방 설정을 업데이트하는 로직
  }

  addChatMessage(player: Player, message: string): void {
    // 채팅 메시지를 추가하는 로직
    sendRoomMessage(this, 'chat', { playerId: player.id, message })
  }
}

export { Room }
