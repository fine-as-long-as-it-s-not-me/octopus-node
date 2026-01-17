import { Player } from '../../modules/player'
import { Room } from '../../modules/room'
import { sendMessage } from '../../utils/message'
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
  name: string
}

type RoomLeaveData = Record<string, never>

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
}

export const roomHandlers: SubTypeHandlerMap<RoomHandlerDataMap> = {
  join(socket, data: RoomJoinData) {
    // 대기방 입장
    const { roomCode, name } = data
    let room = Room.getRoomByCode(roomCode)

    if (room) room.addPlayer(new Player(name, socket))
    else room = Room.createRoom(new Player(name, socket))

    sendMessage(socket, 'welcome', { roomCode: room.code })
  },
  leave(socket, data: RoomLeaveData) {
    // 대기방 나가기
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
