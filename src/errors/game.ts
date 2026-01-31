export const ROUND_INIT_ERROR = new Error('Round initialization failed', {
  cause: 'ROUND_INIT_ERROR',
})

export const GAME_NOT_FOUND_ERROR = new Error('Game not found', {
  cause: 'GAME_NOT_FOUND',
})

export const GAME_ALREADY_IN_PROGRESS_ERROR = new Error('Game already in progress in this room', {
  cause: 'GAME_ALREADY_IN_PROGRESS',
})

export const GAME_CREATE_FAILED_ERROR = new Error('Failed to create game', {
  cause: 'GAME_CREATE_FAILED',
})

export const ONLY_HOST_CAN_START_GAME_ERROR = new Error('Only the host can start the game', {
  cause: 'ONLY_HOST_CAN_START_GAME',
})
