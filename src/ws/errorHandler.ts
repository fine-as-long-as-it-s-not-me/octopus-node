import { WebSocket } from 'ws'
import { sendSocketMessage } from '../lib/socket'

type ErrorHandler = (socket: WebSocket, error?: Error) => void

// Known error causes that are safe to expose to clients
const KNOWN_ERROR_CAUSES = new Set([
  'PLAYER_NOT_FOUND',
  'PLAYER_NOT_IN_ROOM',
  'PLAYER_UNREGISTERED',
  'ROOM_NOT_FOUND',
  'ROOM_CODE_ALREADY_EXISTS',
  'ROOM_CREATE_FAILED',
  'ROOM_ADD_PLAYER_FAILED',
  'ROOM_PLAYER_NOT_FOUND',
  'ROOM_HOST_NOT_FOUND',
  'ROOM_UPDATE_FAILED',
  'ONLY_HOST_CAN_CHANGE_SETTINGS',
  'CUSTOM_WORD_VOTE_CLOSED',
  'INVALID_KEYWORD_EMPTY',
  'INVALID_KEYWORD_TOO_LONG',
  'GAME_NOT_FOUND',
  'ROUND_INIT_ERROR',
  'GAME_ALREADY_IN_PROGRESS',
  'GAME_CREATE_FAILED',
  'ONLY_HOST_CAN_START_GAME',
  'CANVAS_NOT_FOUND',
  'CANVAS_CREATE_FAILED',
  'CANVAS_NOT_ALLOWED',
])

// Get error message, only use error.message if it's from a known error cause
function getErrorMessage(error: Error | undefined, fallbackMessage: string, code: string): string {
  if (!error) {
    return fallbackMessage
  }
  // Only use the error's message if it's from a known error type
  if (error.cause && KNOWN_ERROR_CAUSES.has(error.cause as string)) {
    return error.message
  }
  // For unknown errors, use the fallback to avoid exposing internal details
  return fallbackMessage
}

export const errorHandlers: Record<string, ErrorHandler> = {
  PLAYER_NOT_FOUND: (socket: WebSocket, error?: Error) => {
    console.error('Player not found.')
    sendSocketMessage(socket, 'error', { 
      code: 'PLAYER_NOT_FOUND', 
      message: getErrorMessage(error, 'Player not found.', 'PLAYER_NOT_FOUND')
    })
  },
  PLAYER_NOT_IN_ROOM: (socket: WebSocket, error?: Error) => {
    console.error('Player is not in a room.')
    sendSocketMessage(socket, 'error', { 
      code: 'PLAYER_NOT_IN_ROOM', 
      message: getErrorMessage(error, 'Player is not in a room.', 'PLAYER_NOT_IN_ROOM')
    })
  },
  PLAYER_UNREGISTERED: (socket: WebSocket, error?: Error) => {
    console.error('Player is unregistered.')
    sendSocketMessage(socket, 'error', { 
      code: 'PLAYER_UNREGISTERED', 
      message: getErrorMessage(error, 'Player is unregistered.', 'PLAYER_UNREGISTERED')
    })
  },
  ROOM_NOT_FOUND: (socket: WebSocket, error?: Error) => {
    console.error('Room not found.')
    sendSocketMessage(socket, 'error', { 
      code: 'ROOM_NOT_FOUND', 
      message: getErrorMessage(error, 'Room not found.', 'ROOM_NOT_FOUND')
    })
  },
  ROOM_CODE_ALREADY_EXISTS: (socket: WebSocket, error?: Error) => {
    console.error('Room code already exists.')
    sendSocketMessage(socket, 'error', { 
      code: 'ROOM_CODE_ALREADY_EXISTS', 
      message: getErrorMessage(error, 'Room code already exists.', 'ROOM_CODE_ALREADY_EXISTS')
    })
  },
  ROOM_CREATE_FAILED: (socket: WebSocket, error?: Error) => {
    console.error('Failed to create room.')
    sendSocketMessage(socket, 'error', { 
      code: 'ROOM_CREATE_FAILED', 
      message: getErrorMessage(error, 'Failed to create room.', 'ROOM_CREATE_FAILED')
    })
  },
  ROOM_ADD_PLAYER_FAILED: (socket: WebSocket, error?: Error) => {
    console.error('Adding player to room failed.')
    sendSocketMessage(socket, 'error', { 
      code: 'ROOM_ADD_PLAYER_FAILED', 
      message: getErrorMessage(error, 'Adding player to room failed.', 'ROOM_ADD_PLAYER_FAILED')
    })
  },
  ROOM_PLAYER_NOT_FOUND: (socket: WebSocket, error?: Error) => {
    console.error('Player not found in room.')
    sendSocketMessage(socket, 'error', { 
      code: 'ROOM_PLAYER_NOT_FOUND', 
      message: getErrorMessage(error, 'Player not found in room.', 'ROOM_PLAYER_NOT_FOUND')
    })
  },
  ROOM_HOST_NOT_FOUND: (socket: WebSocket, error?: Error) => {
    console.error('Room host not found.')
    sendSocketMessage(socket, 'error', { 
      code: 'ROOM_HOST_NOT_FOUND', 
      message: getErrorMessage(error, 'Room host not found.', 'ROOM_HOST_NOT_FOUND')
    })
  },
  ROOM_UPDATE_FAILED: (socket: WebSocket, error?: Error) => {
    console.error('Room update failed.')
    sendSocketMessage(socket, 'error', { 
      code: 'ROOM_UPDATE_FAILED', 
      message: getErrorMessage(error, 'Room update failed.', 'ROOM_UPDATE_FAILED')
    })
  },
  ONLY_HOST_CAN_CHANGE_SETTINGS: (socket: WebSocket, error?: Error) => {
    console.error('Only the host can change settings.')
    sendSocketMessage(socket, 'error', { 
      code: 'ONLY_HOST_CAN_CHANGE_SETTINGS', 
      message: getErrorMessage(error, 'Only the host can change settings.', 'ONLY_HOST_CAN_CHANGE_SETTINGS')
    })
  },
  CUSTOM_WORD_VOTE_CLOSED: (socket: WebSocket, error?: Error) => {
    console.error('Custom word voting is closed.')
    sendSocketMessage(socket, 'error', { 
      code: 'CUSTOM_WORD_VOTE_CLOSED', 
      message: getErrorMessage(error, 'Custom word voting is closed.', 'CUSTOM_WORD_VOTE_CLOSED')
    })
  },
  INVALID_KEYWORD_EMPTY: (socket: WebSocket, error?: Error) => {
    console.error('Keyword cannot be empty or only whitespace.')
    sendSocketMessage(socket, 'error', { 
      code: 'INVALID_KEYWORD_EMPTY', 
      message: getErrorMessage(error, 'Keyword cannot be empty or only whitespace.', 'INVALID_KEYWORD_EMPTY')
    })
  },
  INVALID_KEYWORD_TOO_LONG: (socket: WebSocket, error?: Error) => {
    console.error('Keyword exceeds maximum length.')
    sendSocketMessage(socket, 'error', { 
      code: 'INVALID_KEYWORD_TOO_LONG', 
      message: getErrorMessage(error, 'Keyword exceeds maximum length of 50 characters.', 'INVALID_KEYWORD_TOO_LONG')
    })
  },
  GAME_NOT_FOUND: (socket: WebSocket, error?: Error) => {
    console.error('Game not found.')
    sendSocketMessage(socket, 'error', { 
      code: 'GAME_NOT_FOUND', 
      message: getErrorMessage(error, 'Game not found.', 'GAME_NOT_FOUND')
    })
  },
  ROUND_INIT_ERROR: (socket: WebSocket, error?: Error) => {
    console.error('Round initialization failed.')
    sendSocketMessage(socket, 'error', { 
      code: 'ROUND_INIT_ERROR', 
      message: getErrorMessage(error, 'Round initialization failed.', 'ROUND_INIT_ERROR')
    })
  },
  GAME_ALREADY_IN_PROGRESS: (socket: WebSocket, error?: Error) => {
    console.error('Game already in progress in this room.')
    sendSocketMessage(socket, 'error', { 
      code: 'GAME_ALREADY_IN_PROGRESS', 
      message: getErrorMessage(error, 'Game already in progress in this room.', 'GAME_ALREADY_IN_PROGRESS')
    })
  },
  GAME_CREATE_FAILED: (socket: WebSocket, error?: Error) => {
    console.error('Failed to create game.')
    sendSocketMessage(socket, 'error', { 
      code: 'GAME_CREATE_FAILED', 
      message: getErrorMessage(error, 'Failed to create game.', 'GAME_CREATE_FAILED')
    })
  },
  ONLY_HOST_CAN_START_GAME: (socket: WebSocket, error?: Error) => {
    console.error('Only the host can start the game.')
    sendSocketMessage(socket, 'error', { 
      code: 'ONLY_HOST_CAN_START_GAME', 
      message: getErrorMessage(error, 'Only the host can start the game.', 'ONLY_HOST_CAN_START_GAME')
    })
  },
  CANVAS_NOT_FOUND: (socket: WebSocket, error?: Error) => {
    console.error('Canvas not found.')
    sendSocketMessage(socket, 'error', { 
      code: 'CANVAS_NOT_FOUND', 
      message: getErrorMessage(error, 'Canvas not found.', 'CANVAS_NOT_FOUND')
    })
  },
  CANVAS_CREATE_FAILED: (socket: WebSocket, error?: Error) => {
    console.error('Failed to create canvas.')
    sendSocketMessage(socket, 'error', { 
      code: 'CANVAS_CREATE_FAILED', 
      message: getErrorMessage(error, 'Failed to create canvas.', 'CANVAS_CREATE_FAILED')
    })
  },
  CANVAS_NOT_ALLOWED: (socket: WebSocket, error?: Error) => {
    console.error('Not allowed to modify canvas.')
    sendSocketMessage(socket, 'error', { 
      code: 'CANVAS_NOT_ALLOWED', 
      message: getErrorMessage(error, 'Not allowed to modify canvas.', 'CANVAS_NOT_ALLOWED')
    })
  },
  INTERNAL_ERROR: (socket: WebSocket, error?: Error) => {
    console.error('An internal error occurred.')
    sendSocketMessage(socket, 'error', { 
      code: 'INTERNAL_ERROR', 
      message: getErrorMessage(error, 'An internal error occurred.', 'INTERNAL_ERROR')
    })
  },
}
