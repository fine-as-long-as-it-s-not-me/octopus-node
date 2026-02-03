import { ChangeableSettings } from '../../data/types'
import { roomService } from '../../services/RoomService'
import { SubTypeHandlerMap } from '../types'
import { INVALID_KEYWORD_EMPTY_ERROR, INVALID_KEYWORD_TOO_LONG_ERROR } from '../../errors/room'
import { MAX_KEYWORD_LENGTH } from '../../consts'

type RoomJoinRequest = {
  roomCode: string
  UUID: string
  name: string
}

type RoomAnonymousJoinRequest = {
  roomCode: string
}

type RoomRandomJoinRequest = {
  UUID: string
  name: string
}

type RoomLeaveRequest = {
  roomCode: string
}

type RoomVoteKeywordRequest = {
  roomCode: string
  keyword: string
  UUID: string
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
  vote_keyword_anonymous: RoomVoteKeywordRequest
  change_settings: RoomSettingsUpdatedRequest
  join_random: RoomRandomJoinRequest
  join_private: RoomJoinRequest
  join_anonymous: RoomAnonymousJoinRequest
}

export const roomHandlers: SubTypeHandlerMap<RoomHandlerRequestMap> = {
  join(socket, data: RoomJoinRequest) {
    const { roomCode, UUID } = data
    roomService.join(socket, roomCode, UUID)
  },
  join_private(socket, data: RoomJoinRequest) {
    const { roomCode, UUID } = data
    roomService.joinPrivate(socket, roomCode, UUID)
  },
  join_random(socket, data: RoomRandomJoinRequest) {
    const { UUID } = data
    roomService.joinRandom(socket, UUID)
  },
  join_anonymous(socket, data: RoomAnonymousJoinRequest) {
    const { roomCode } = data
    roomService.joinAnonymous(socket, roomCode)
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

    // Validate keyword
    const trimmedKeyword = keyword.trim()

    // Check if keyword is empty or only whitespace
    if (!trimmedKeyword) {
      throw INVALID_KEYWORD_EMPTY_ERROR
    }

    // Check maximum length (reasonable limit for display and storage)
    if (trimmedKeyword.length > MAX_KEYWORD_LENGTH) {
      throw INVALID_KEYWORD_TOO_LONG_ERROR
    }

    // Use sanitized keyword (trimmed)
    roomService.voteCustomKeyword(socket, trimmedKeyword)
  },
  vote_keyword_anonymous(socket, data: RoomVoteKeywordRequest) {
    // 익명 커스텀 제시어 투표
    const { keyword, roomCode, UUID } = data

    // Validate keyword
    const trimmedKeyword = keyword.trim()

    // Check if keyword is empty or only whitespace
    if (!trimmedKeyword) {
      throw INVALID_KEYWORD_EMPTY_ERROR
    }

    // Check maximum length (reasonable limit for display and storage)
    if (trimmedKeyword.length > MAX_KEYWORD_LENGTH) {
      throw INVALID_KEYWORD_TOO_LONG_ERROR
    }

    // Use sanitized keyword (trimmed)
    roomService.voteCustomKeywordAnonymous(socket, roomCode, UUID, trimmedKeyword)
  },
  delete_keyword(socket, data: RoomDeleteKeywordRequest) {
    // 등록된 커스텀 제시어 제거
    const { keyword } = data
    roomService.deleteCustomKeyword(socket, keyword)
  },
  change_settings(socket, data: RoomSettingsUpdatedRequest) {
    // 설정 변경
    const { settings } = data
    roomService.changeSettings(socket, settings)
  },
}
