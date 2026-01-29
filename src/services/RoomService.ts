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
      code,
      settings: { ...DEFAULT_SETTING, ...settings, lang: host.lang },
    })

    this.join(room.code, socket, host.UUID)
  }

  changeSettings(socket: WebSocket, settings: ChangeableSettings): void {
    const player = playerRepository.findBySocket(socket)
    if (!player || !player.roomId) return sendSocketMessage(socket, 'error')

    let room = roomRepository.findById(player.roomId)
    if (!room || room.hostId !== player.id) return sendSocketMessage(socket, 'error')

    roomRepository.update(room.id, { settings: { ...room.settings, ...settings } })
    this.updateSettings(room.id)
  }

  // 플레이어 추가
  join(code: string, socket: WebSocket, UUID: string): void {
    let player = playerRepository.findByUUID(UUID)
    if (!player) return sendSocketMessage(socket, 'unregistered')

    const room = roomRepository.findByCode(code)
    if (!room) {
      this.createRoom(socket, undefined, code)
    } else {
      roomRepository.addPlayer(room.id, player)

      roomService.addSystemChatMessage(room.id, 'player_joined', { name: player.name })
      this.sendWelcomeMessage(room, player)
      this.updatePlayers(room.id)
      this.updateSettings(room.id)
    }
  }

  joinRandom(socket: WebSocket, UUID: string): void {
    let player = playerRepository.findByUUID(UUID)
    if (!player) return sendSocketMessage(socket, 'unregistered')

    let room = roomRepository.getRandomRoom(player.lang)
    if (room && room.code) this.join(room.code, socket, UUID)
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

    this.addSystemChatMessage(room.id, 'player_left', { name: player.name })
  }

  updatePlayers(roomId: number): void {
    const room = roomRepository.findById(roomId)
    if (!room || !room.hostId) throw new Error('Updating players failed')

    const host = playerRepository.findById(room.hostId)
    if (!host) throw new Error('Updating players failed : no host')

    this.sendMessage(room, 'players_updated', {
      hostUUID: host.UUID,
      players: room.players
        .map((p) => playerRepository.getResponseDTO(p.id))
        .filter((playerDTO) => playerDTO !== null),
    })
  }

  updateSettings(roomId: number): void {
    const room = roomRepository.findById(roomId)
    if (!room) throw new Error('Updating settings failed')
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

  addChatMessage(socket: WebSocket, text: string): void {
    const player = playerRepository.findBySocket(socket)
    if (!player || !player.roomId) return sendSocketMessage(socket, 'error')

    const room = roomRepository.findById(player.roomId)
    if (!room) return sendSocketMessage(socket, 'error')

    this.sendMessage(room, 'chat_added', {
      player: playerRepository.getResponseDTO(player.id),
      text,
    })
  }

  addSystemChatMessage(roomId: number, type: string, variable?: object): void {
    const room = roomRepository.findById(roomId)
    if (!room) return

    this.sendMessage(room, 'system_chat', {
      type,
      variable,
    })
  }
}

const roomService = new RoomService()

export { roomService }
