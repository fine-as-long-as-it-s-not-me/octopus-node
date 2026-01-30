export const PLAYER_NOT_FOUND_ERROR = new Error('Player not found', {
  cause: 'PLAYER_NOT_FOUND',
})

export const PLAYER_NOT_IN_ROOM_ERROR = new Error('Player not in a room', {
  cause: 'PLAYER_NOT_IN_ROOM',
})

export const PLAYER_UNREGISTERED_ERROR = new Error('Player is unregistered', {
  cause: 'PLAYER_UNREGISTERED',
})
