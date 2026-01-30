export const errorHandlers = {
  PLAYER_NOT_IN_ROOM: () => {
    // Handle player not in room error
    console.error('Player is not in a room.')
  },
  INTERNAL_ERROR: () => {
    // Handle internal server error
    console.error('An internal error occurred.')
  },
}
