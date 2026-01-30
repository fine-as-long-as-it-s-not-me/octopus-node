import { DECREASE_TIME_AMOUNT, INCREASE_TIME_AMOUNT } from '../../consts'
import { discussionService } from '../../services/DiscussionService'
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
    discussionService.changeDiscussionTime(socket, INCREASE_TIME_AMOUNT)
  },
  decrease_time(socket, data: DiscussionDecreaseTimeHandler) {
    // 토론 시간 줄이기 요청
    discussionService.changeDiscussionTime(socket, DECREASE_TIME_AMOUNT)
  },
}
