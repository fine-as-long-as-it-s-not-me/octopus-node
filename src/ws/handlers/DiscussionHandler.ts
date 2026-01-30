import { DECREASE_TIME_AMOUNT, INCREASE_TIME_AMOUNT } from '../../consts'
import { discussionService } from '../../services/DiscussionService'
import { SubTypeHandlerMap } from '../types'

type change_time = {
  type: 'increase' | 'decrease'
}

type DiscussionHandlerHandlerMap = {
  change_time: change_time
}

export const discussionHandlers: SubTypeHandlerMap<DiscussionHandlerHandlerMap> = {
  change_time(socket, data) {
    const { type } = data
    // 토론 시간 변경 요청
    const amount = type === 'increase' ? INCREASE_TIME_AMOUNT : DECREASE_TIME_AMOUNT
    discussionService.changeDiscussionTime(socket, amount)
  },
}
