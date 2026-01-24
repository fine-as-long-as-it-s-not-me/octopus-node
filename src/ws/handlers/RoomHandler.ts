import { Settings } from '../../data/types'
import { roomService } from '../../services/RoomService'
import { SubTypeHandlerMap } from '../types'

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

type RoomVoteKeywordData = {
  keyword: string
}

type RoomDeleteKeywordData = {
  keyword: string
}

type RoomSettingsUpdatedData = {
  settings: Omit<Settings, 'language'>
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
    const { roomCode, UUID, name } = data
    roomService.join(roomCode, socket, UUID, name)
  },
  join_random(socket, data: RoomRandomJoinData) {
    const { UUID, name } = data
    roomService.joinRandom(socket, UUID, name)
  },
  leave(socket, data: RoomLeaveData) {
    const { roomCode } = data
    roomService.leave(roomCode, socket)
  },
  vote_keyword(socket, data: RoomVoteKeywordData) {
    // 커스텀 제시어 투표
  },
  delete_keyword(socket, data: RoomDeleteKeywordData) {
    // 등록된 커스텀 제시어 제거
  },
  update_setting(socket, data: RoomSettingsUpdatedData) {
    // 설정 변경
  },
}
