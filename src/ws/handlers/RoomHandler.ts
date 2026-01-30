import { ChangeableSettings } from '../../data/types'
import { roomService } from '../../services/RoomService'
import { SubTypeHandlerMap } from '../types'

type RoomJoinRequest = {
  roomCode: string
  UUID: string
  name: string
}

type RoomRandomJoinRequest = {
  UUID: string
  name: string
}

type RoomLeaveRequest = {
  roomCode: string
}

type RoomVoteKeywordRequest = {
  keyword: string
}

type RoomDeleteKeywordRequest = {
  keyword: string
}

type RoomSettingsUpdatedRequest = {
  settings: ChangeableSettings
}

type RoomCreateRequest = {
  settings: ChangeableSettings
}

type RoomHandlerRequestMap = {
  join: RoomJoinRequest
  leave: RoomLeaveRequest
  create: RoomCreateRequest
  delete_keyword: RoomDeleteKeywordRequest
  vote_keyword: RoomVoteKeywordRequest
  change_settings: RoomSettingsUpdatedRequest
  join_random: RoomRandomJoinRequest
}

export const roomHandlers: SubTypeHandlerMap<RoomHandlerRequestMap> = {
  join(socket, data: RoomJoinRequest) {
    const { roomCode, UUID } = data
    roomService.join(roomCode, socket, UUID)
  },
  join_random(socket, data: RoomRandomJoinRequest) {
    const { UUID } = data
    roomService.joinRandom(socket, UUID)
  },
  leave(socket, data: RoomLeaveRequest) {
    const { roomCode } = data
    roomService.leave(roomCode, socket)
  },
  create(socket, data: RoomCreateRequest) {
    // 방 생성
    const { settings } = data
    roomService.createRoom(socket, settings)
  },
  vote_keyword(socket, data: RoomVoteKeywordRequest) {
    // 커스텀 제시어 투표
    const { keyword } = data
    roomService.voteCustomWord(socket, keyword)
  },
  delete_keyword(socket, data: RoomDeleteKeywordRequest) {
    // 등록된 커스텀 제시어 제거
  },
  change_settings(socket, data: RoomSettingsUpdatedRequest) {
    // 설정 변경
    const { settings } = data
    roomService.changeSettings(socket, settings)
  },
}
