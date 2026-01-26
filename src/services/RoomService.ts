import { WebSocket } from 'ws'
import { PlayerData } from '../data/PlayerData'
import { RoomData } from '../data/RoomData'
import { playerRepository } from '../repositories/PlayerRepository'
import { roomRepository } from '../repositories/RoomRepository'
import { DEFAULT_SETTING } from '../consts'
import { playerService } from './PlayerService'
import { ChangeableSettings } from '../data/types'
import { sendSocketMessage } from '../lib/socket'

class RoomService {
  createRoom(socket: WebSocket, settings?: ChangeableSettings, code?: string) {
    const host = playerRepository.findBySocket(socket)
    if (!host) {
      sendSocketMessage(socket, 'unregistered')
      return null
    }

    // 설정한 세팅과, 기본 세팅 조합해서 방 생성
    const room = roomRepository.create({
      host,
      code,
      settings: { ...DEFAULT_SETTING, ...settings, lang: host.lang },
    })
    this.sendWelcomeMessage(room, host)
    this.updatePlayers(room.id)
    this.updateSettings(room.id)

    return room
  }

  changeSettings(socket: WebSocket, settings: ChangeableSettings): void {
    const player = playerRepository.findBySocket(socket)
    if (!player || !player.roomId) return sendSocketMessage(socket, 'error')

    let room = roomRepository.findById(player.roomId)
    if (!room || room.host.id !== player.id) return sendSocketMessage(socket, 'error')

    roomRepository.update(room.id, { settings: { ...room.settings, ...settings } })
    this.updateSettings(room.id)
  }

  // 플레이어 추가
  join(code: string, socket: WebSocket, UUID: string, name: string): void {
    let player = playerRepository.findByUUID(UUID)
    if (!player) return sendSocketMessage(socket, 'unregistered')

    const room = roomRepository.findByCode(code)
    if (!room) {
      this.createRoom(socket, undefined, code)
    } else {
      roomRepository.addPlayer(room.id, player)
      this.sendWelcomeMessage(room, player)
      this.updatePlayers(room.id)
      this.updateSettings(room.id)
    }
  }

  joinRandom(socket: WebSocket, UUID: string, name: string): void {
    let player = playerRepository.findByUUID(UUID)
    if (!player) return sendSocketMessage(socket, 'unregistered')

    let room = roomRepository.getRandomRoom(player.lang)
    if (room && room.code) this.join(room.code, socket, UUID, name)
    else this.createRoom(socket)
  }

  // 대기방 나가기
  leave(roomCode: string, socket: WebSocket): void {
    const room = roomRepository.findByCode(roomCode)
    if (!room) return

    const player = room.players.find((p) => p.socket === socket)
    if (!player) return

    roomRepository.removePlayer(room, player.id)
    player.roomId = null
    this.updatePlayers(room.id)
  }

  //--- Socket Broadcasts---

  updatePlayers(roomId: number): void {
    const room = roomRepository.findById(roomId)
    if (!room) return
    this.sendMessage(room, 'players_updated', {
      hostUUID: room.host.UUID,
      players: room.players
        .map((p) => playerRepository.getResponseDTO(p.id))
        .filter((playerDTO) => playerDTO !== null),
    })
  }

  updateSettings(roomId: number): void {
    const room = roomRepository.findById(roomId)
    if (!room) return
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
