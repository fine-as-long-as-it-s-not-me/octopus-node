export const ROOM_NOT_FOUND_ERROR = new Error('Room not found', {
  cause: 'ROOM_NOT_FOUND',
})

export const ROOM_CODE_ALREADY_EXISTS_ERROR = new Error('Room code already exists', {
  cause: 'ROOM_CODE_ALREADY_EXISTS',
})

export const ROOM_CREATE_FAILED_ERROR = new Error('Failed to create room', {
  cause: 'ROOM_CREATE_FAILED',
})

export const ROOM_ADD_PLAYER_FAILED_ERROR = new Error('Adding player to room failed', {
  cause: 'ROOM_ADD_PLAYER_FAILED',
})

export const ROOM_PLAYER_NOT_FOUND_ERROR = new Error('Player not found in room', {
  cause: 'ROOM_PLAYER_NOT_FOUND',
})

export const ROOM_HOST_NOT_FOUND_ERROR = new Error('Room host not found', {
  cause: 'ROOM_HOST_NOT_FOUND',
})

export const ROOM_UPDATE_FAILED_ERROR = new Error('Room update failed', {
  cause: 'ROOM_UPDATE_FAILED',
})

export const ONLY_HOST_CAN_CHANGE_SETTINGS_ERROR = new Error('Only the host can change settings', {
  cause: 'ONLY_HOST_CAN_CHANGE_SETTINGS',
})

export const CUSTOM_WORD_VOTE_CLOSED_ERROR = new Error('Custom word voting is closed', {
  cause: 'CUSTOM_WORD_VOTE_CLOSED',
})

export const INVALID_KEYWORD_EMPTY_ERROR = new Error('Keyword cannot be empty or only whitespace', {
  cause: 'INVALID_KEYWORD_EMPTY',
})

export const INVALID_KEYWORD_TOO_LONG_ERROR = new Error(
  'Keyword exceeds maximum length of 50 characters',
  {
    cause: 'INVALID_KEYWORD_TOO_LONG',
  },
)

export const NO_ACCESS_TO_PRIVATE_ROOM_ERROR = new Error('No access to private room', {
  cause: 'NO_ACCESS_TO_PRIVATE_ROOM',
})

export const ONLY_HOST_CAN_KICK_ERROR = new Error('Only the host can kick players', {
  cause: 'ONLY_HOST_CAN_KICK',
})

export const ROOM_NOT_CONFIGUREABLE_ERROR = new Error('Room is not configureable at this time', {
  cause: 'ROOM_NOT_CONFIGUREABLE',
})
