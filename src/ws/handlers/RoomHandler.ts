import { Player } from '../../services/PlayerService'
import { Room } from '../../services/RoomService'
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
    const player = new Player(name, socket)
    if (room) room.addPlayer(player)
    else room = Room.createRoom(player)

    sendMessage(socket, 'welcome', { userId: player.id, roomCode: room.code })
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
