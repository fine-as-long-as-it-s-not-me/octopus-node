import { DEFAULT_SETTING } from '../../consts'
import { PlayerData } from '../../data/PlayerData'
import { playerRepository } from '../../repositories/PlayerRepository'
import { roomRepository } from '../../repositories/RoomRepository'
import { playerService } from '../../services/PlayerService'
import { roomService } from '../../services/RoomService'
import { SubTypeHandlerMap } from '../types'

type RoomSettings = {
  roundCount: number
  drawTimeLimit: number
  isSecretRoom: boolean
  language: string
  wordPoolSize: number
  isVoteOpen: boolean
  minimumVotes: number
}

type RoomJoinData = {
  roomCode: string
  UUID: string
  name: string
}

type RoomRandomJoinData = {
  UUID: string
  name: string
}

type RoomLeaveData = {
  roomCode: string
}

type RoomDeleteKeywordData = {
  keyword: string
}

type RoomVoteKeywordData = {
  keyword: string
}

type RoomSettingsUpdatedData = {
  settings: RoomSettings
}

type RoomHandlerDataMap = {
  join: RoomJoinData
  leave: RoomLeaveData
  delete_keyword: RoomDeleteKeywordData
  vote_keyword: RoomVoteKeywordData
  update_setting: RoomSettingsUpdatedData
  join_random: RoomRandomJoinData
}

export const roomHandlers: SubTypeHandlerMap<RoomHandlerDataMap> = {
  join(socket, data: RoomJoinData) {
    // 대기방 입장
    const { roomCode, UUID, name } = data
    roomService.join(roomCode, socket, UUID, name)
  },
  join_random(socket, data: RoomRandomJoinData) {
    // 랜덤 대기방 입장
    const { UUID, name } = data
    roomService.joinRandom(socket, UUID, name)
  },
  leave(socket, data: RoomLeaveData) {
    // 대기방 나가기
    const { roomCode } = data
    const room = roomRepository.findByCode(roomCode)
    if (!room) return
    const player = room.players.find((p) => p.socket === socket)
    if (!player) return
    roomService.removePlayer(room, player.id)
  },
  delete_keyword(socket, data: RoomDeleteKeywordData) {
    // 등록된 커스텀 제시어 제거
  },
  vote_keyword(socket, data: RoomVoteKeywordData) {
    // 커스텀 제시어 투표
  },
  update_setting(socket, data: RoomSettingsUpdatedData) {
    // 설정 변경
  },
}
