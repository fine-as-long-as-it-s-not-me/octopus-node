import { Room } from "./types";

const rooms = new Map<string, Room>();

function joinRoom (userId: string, roomId: string): void {
  // 사용자를 방에 참여시키는 로직
}

function leaveRoom (userId: string, roomId: string): void {
  // 사용자를 방에서 나가게 하는 로직
}

function createRoom (settings: Record<string, any>): string {
  // 새로운 방을 생성하는 로직
  return ""
}

function deleteKeyword (roomId: string, keyword: string): void {
  // 방에서 커스텀 제시어를 제거하는 로직
}

function voteKeyword (roomId: string, keyword: string): void {
  // 방에서 커스텀 제시어에 투표하는 로직
}

function updateRoomSettings (roomId: string, settings: Record<string, any>): void {
  // 방 설정을 업데이트하는 로직
}

export { joinRoom, leaveRoom, createRoom, deleteKeyword, voteKeyword, updateRoomSettings };