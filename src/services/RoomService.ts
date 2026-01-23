import { WebSocket } from 'ws'
import { PlayerData } from '../data/PlayerData'
import { RoomData } from '../data/RoomData'
import { playerRepository } from '../repositories/PlayerRepository'
import { roomRepository } from '../repositories/RoomRepository'
import { sendMessage } from '../utils/message'
import { Setting } from './types'
import { DEFAULT_SETTING } from '../consts'

class RoomService {
  createRoom(host: PlayerData, setting: Setting, code?: string) {
    const room = roomRepository.create({ host, code, setting })
    this.sendWelcomeMessage(room, host)
    this.updatePlayers(room)

    return room
  }

  getRandomRoom(): RoomData | undefined {
    const publicRooms = Array.from(
      roomRepository.search((room) => {
        return room.setting.roomType === 'public' && !room.game
      }),
    )
    if (publicRooms.length === 0) return undefined
    const randomIndex = Math.floor(Math.random() * publicRooms.length)
    return publicRooms[randomIndex]
  }

  // 플레이어 목록 업데이트
  updatePlayers(room: RoomData): void {
    room.players.forEach((player) => {
      sendMessage(player.socket, 'players_updated', {
        hostId: room.host.id,
        players: room.players,
      })
    })
  }

  // 플레이어 추가
  join(code: string, socket: WebSocket, UUID: string, name: string): void {
    let player = playerRepository.findByUUID(UUID)
    if (!player) {
      player = playerRepository.create({ UUID, name, socket })
    }

    let room = roomRepository.findByCode(code)
    if (!room) room = this.createRoom(player, DEFAULT_SETTING, code)
    else room.players.push(player)

    this.sendWelcomeMessage(room, player)
    this.updatePlayers(room)
  }

  joinRandom(socket: WebSocket, UUID: string, name: string): void {
    let player = playerRepository.findByUUID(UUID)
    if (!player) {
      player = playerRepository.create({ UUID, name, socket })
    }

    let room = this.getRandomRoom()
    if (!room) room = this.createRoom(player, DEFAULT_SETTING)
    else room.players.push(player)

    this.sendWelcomeMessage(room, player)
    this.updatePlayers(room)
  }

  // 플레이어 제거
  removePlayer(room: RoomData, playerId: number): void {
    if (!playerId) return
    room.players = room.players.filter((p) => p.id !== playerId)
    if (room.players.length === 0) {
      roomRepository.delete(room.id)
    } else {
      if (room.host.id === playerId) room.host = room.players[0]
      this.updatePlayers(room)
    }
  }

  sendWelcomeMessage(room: RoomData, player: PlayerData): void {
    sendMessage(player.socket, 'welcome', { roomCode: room.code })
  }
}

const roomService = new RoomService()

export { roomService }
