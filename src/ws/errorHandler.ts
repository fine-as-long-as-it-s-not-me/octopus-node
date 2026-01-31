export const errorHandlers = {
  PLAYER_NOT_FOUND: () => {
    console.error('Player not found.')
  },
  PLAYER_NOT_IN_ROOM: () => {
    // Handle player not in room error
    console.error('Player is not in a room.')
  },
  PLAYER_UNREGISTERED: () => {
    console.error('Player is unregistered.')
  },
  ROOM_NOT_FOUND: () => {
    console.error('Room not found.')
  },
  ROOM_CODE_ALREADY_EXISTS: () => {
    console.error('Room code already exists.')
  },
  ROOM_CREATE_FAILED: () => {
    console.error('Failed to create room.')
  },
  ROOM_ADD_PLAYER_FAILED: () => {
    console.error('Adding player to room failed.')
  },
  ROOM_PLAYER_NOT_FOUND: () => {
    console.error('Player not found in room.')
  },
  ROOM_HOST_NOT_FOUND: () => {
    console.error('Room host not found.')
  },
  ROOM_UPDATE_FAILED: () => {
    console.error('Room update failed.')
  },
  ONLY_HOST_CAN_CHANGE_SETTINGS: () => {
    console.error('Only the host can change settings.')
    // send auth error to client
  },
  GAME_NOT_FOUND: () => {
    console.error('Game not found.')
  },
  ROUND_INIT_ERROR: () => {
    console.error('Round initialization failed.')
  },
  GAME_ALREADY_IN_PROGRESS: () => {
    console.error('Game already in progress in this room.')
  },
  GAME_CREATE_FAILED: () => {
    console.error('Failed to create game.')
  },
  ONLY_HOST_CAN_START_GAME: () => {
    console.error('Only the host can start the game.')
  },
  CANVAS_NOT_FOUND: () => {
    console.error('Canvas not found.')
  },
  CANVAS_CREATE_FAILED: () => {
    console.error('Failed to create canvas.')
  },
  CANVAS_NOT_ALLOWED: () => {
    console.error('Not allowed to modify canvas.')
  },
  INTERNAL_ERROR: () => {
    // Handle internal server error
    console.error('An internal error occurred.')
  },
}
