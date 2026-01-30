import { WebSocket } from 'ws'
import { PlayerData } from '../data/PlayerData'
import { RoomData } from '../data/RoomData'
import { playerRepository } from '../repositories/PlayerRepository'
import { roomRepository } from '../repositories/RoomRepository'
import { DEFAULT_SETTING } from '../consts'
import { playerService } from './PlayerService'
import { ChangeableSettings } from '../data/types'
import { chatService } from './ChatService'
import {
  ONLY_HOST_CAN_CHANGE_SETTINGS_ERROR,
  ROOM_HOST_NOT_FOUND_ERROR,
  ROOM_NOT_FOUND_ERROR,
  ROOM_PLAYER_NOT_FOUND_ERROR,
  ROOM_UPDATE_FAILED_ERROR,
} from '../errors/room'
import { PLAYER_NOT_IN_ROOM_ERROR, PLAYER_UNREGISTERED_ERROR } from '../errors/player'

class RoomService {
  createRoom(socket: WebSocket, settings?: ChangeableSettings, code?: string) {
    const host = playerRepository.findBySocket(socket)
    if (!host) throw PLAYER_UNREGISTERED_ERROR

    // 설정한 세팅과, 기본 세팅 조합해서 방 생성
    const room = roomRepository.create({
      code,
      settings: { ...DEFAULT_SETTING, ...settings, lang: host.lang },
    })

    this.join(room.code, socket, host.UUID)
  }

  changeSettings(socket: WebSocket, settings: ChangeableSettings): void {
    const player = playerRepository.findBySocket(socket)
    if (!player) throw PLAYER_UNREGISTERED_ERROR
    if (!player.roomId) throw PLAYER_NOT_IN_ROOM_ERROR

    let room = roomRepository.findById(player.roomId)
    if (!room) throw ROOM_NOT_FOUND_ERROR

    if (room.hostId !== player.id) throw ONLY_HOST_CAN_CHANGE_SETTINGS_ERROR

    roomRepository.update(room.id, { settings: { ...room.settings, ...settings } })
    this.updateSettings(room.id)
  }

  // 플레이어 추가
  join(code: string, socket: WebSocket, UUID: string): void {
    let player = playerRepository.findByUUID(UUID)
    if (!player) throw PLAYER_UNREGISTERED_ERROR

    const room = roomRepository.findByCode(code)
    if (!room) {
      this.createRoom(socket, undefined, code)
    } else {
      roomRepository.addPlayer(room.id, player)

      chatService.addSystemChatMessage(room.id, 'player_joined', { name: player.name })
      this.sendWelcomeMessage(room, player)
      this.updatePlayers(room.id)
      this.updateSettings(room.id)
    }
  }

  joinRandom(socket: WebSocket, UUID: string): void {
    let player = playerRepository.findByUUID(UUID)
    if (!player) throw PLAYER_UNREGISTERED_ERROR

    let room = roomRepository.getRandomRoom(player.lang)
    if (room && room.code) this.join(room.code, socket, UUID)
    else this.createRoom(socket)
  }

  // 대기방 나가기
  leave(roomCode: string, socket: WebSocket): void {
    const room = roomRepository.findByCode(roomCode)
    if (!room) throw ROOM_NOT_FOUND_ERROR

    const player = room.players.find((p) => p.socket === socket)
    if (!player) throw ROOM_PLAYER_NOT_FOUND_ERROR

    roomRepository.removePlayer(room, player.id)
    player.roomId = null
    this.updatePlayers(room.id)

    chatService.addSystemChatMessage(room.id, 'player_left', { name: player.name })
  }

  updatePlayers(roomId: number): void {
    const room = roomRepository.findById(roomId)
    if (!room || !room.hostId) throw ROOM_UPDATE_FAILED_ERROR

    const host = playerRepository.findById(room.hostId)
    if (!host) throw ROOM_HOST_NOT_FOUND_ERROR

    this.sendMessage(room, 'players_updated', {
      hostUUID: host.UUID,
      players: room.players
        .map((p) => playerRepository.getResponseDTO(p.id))
        .filter((playerDTO) => playerDTO !== null),
    })
  }

  updateSettings(roomId: number): void {
    const room = roomRepository.findById(roomId)
    if (!room) throw ROOM_NOT_FOUND_ERROR
    this.sendMessage(room, 'settings_updated', {
      settings: room.settings,
    })
  }

  sendWelcomeMessage(room: RoomData, player: PlayerData): void {
    playerService.sendMessage(player.id, 'welcome', { roomCode: room.code })
  }

  sendMessage(room: RoomData, type: string, data: any): void {
    for (const player of room.players) playerService.sendMessage(player.id, type, data)
  }
}

const roomService = new RoomService()

export { roomService }
