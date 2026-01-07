import { SubTypeHandlerMap } from '../types'

type DiscussionIncreaseTimeData = Record<string, never>
type DiscussionDecreaseTimeData = Record<string, never>

type DiscussionHandlerDataMap = {
  increase_time: DiscussionIncreaseTimeData
  decrease_time: DiscussionDecreaseTimeData
}

export const discussionHandlers: SubTypeHandlerMap<DiscussionHandlerDataMap> = {
  increase_time (socket, data: DiscussionIncreaseTimeData) {
    // 토론 시간 늘리기 요청
  },
  decrease_time (socket, data: DiscussionDecreaseTimeData) {
    // 토론 시간 줄이기 요청
  }
}
