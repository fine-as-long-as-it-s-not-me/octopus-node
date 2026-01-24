import { SubTypeHandlerMap } from '../types'

type DiscussionIncreaseTimeHandler = Record<string, never>
type DiscussionDecreaseTimeHandler = Record<string, never>

type DiscussionHandlerHandlerMap = {
  increase_time: DiscussionIncreaseTimeHandler
  decrease_time: DiscussionDecreaseTimeHandler
}

export const discussionHandlers: SubTypeHandlerMap<DiscussionHandlerHandlerMap> = {
  increase_time(socket, data: DiscussionIncreaseTimeHandler) {
    // 토론 시간 늘리기 요청
  },
  decrease_time(socket, data: DiscussionDecreaseTimeHandler) {
    // 토론 시간 줄이기 요청
  },
}
