import { WebSocket } from 'ws'
import { sendSocketMessage } from '../lib/socket'

export const errorHandlers: Record<string, (socket: WebSocket) => void> = {
  PLAYER_NOT_FOUND: (socket) => {
    console.error('Player not found.')
    sendSocketMessage(socket, 'error', { message: 'Player not found.', cause: 'PLAYER_NOT_FOUND' })
  },
  PLAYER_NOT_IN_ROOM: (socket) => {
    // Handle player not in room error
    console.error('Player is not in a room.')
    sendSocketMessage(socket, 'error', {
      message: 'Player is not in a room.',
      cause: 'PLAYER_NOT_IN_ROOM',
    })
  },
  PLAYER_UNREGISTERED: (socket) => {
    console.error('Player is unregistered.')
    sendSocketMessage(socket, 'error', {
      message: 'Player is unregistered.',
      cause: 'PLAYER_UNREGISTERED',
    })
  },
  ROOM_NOT_FOUND: (socket) => {
    console.error('Room not found.')
    sendSocketMessage(socket, 'error', { message: 'Room not found.', cause: 'ROOM_NOT_FOUND' })
  },
  ROOM_CODE_ALREADY_EXISTS: (socket) => {
    console.error('Room code already exists.')
    sendSocketMessage(socket, 'error', {
      message: 'Room code already exists.',
      cause: 'ROOM_CODE_ALREADY_EXISTS',
    })
  },
  ROOM_CREATE_FAILED: (socket) => {
    console.error('Failed to create room.')
    sendSocketMessage(socket, 'error', {
      message: 'Failed to create room.',
      cause: 'ROOM_CREATE_FAILED',
    })
  },
  ROOM_ADD_PLAYER_FAILED: (socket) => {
    console.error('Adding player to room failed.')
    sendSocketMessage(socket, 'error', {
      message: 'Adding player to room failed.',
      cause: 'ROOM_ADD_PLAYER_FAILED',
    })
  },
  ROOM_PLAYER_NOT_FOUND: (socket) => {
    console.error('Player not found in room.')
    sendSocketMessage(socket, 'error', {
      message: 'Player not found in room.',
      cause: 'ROOM_PLAYER_NOT_FOUND',
    })
  },
  ROOM_HOST_NOT_FOUND: (socket) => {
    console.error('Room host not found.')
    sendSocketMessage(socket, 'error', {
      message: 'Room host not found.',
      cause: 'ROOM_HOST_NOT_FOUND',
    })
  },
  ROOM_UPDATE_FAILED: (socket) => {
    console.error('Room update failed.')
    sendSocketMessage(socket, 'error', {
      message: 'Room update failed.',
      cause: 'ROOM_UPDATE_FAILED',
    })
  },
  ONLY_HOST_CAN_CHANGE_SETTINGS: (socket) => {
    console.error('Only the host can change settings.')
    sendSocketMessage(socket, 'error', {
      message: 'Only the host can change settings.',
      cause: 'ONLY_HOST_CAN_CHANGE_SETTINGS',
    })
    // send auth error to client
  },
  GAME_NOT_FOUND: (socket) => {
    console.error('Game not found.')
    sendSocketMessage(socket, 'error', { message: 'Game not found.', cause: 'GAME_NOT_FOUND' })
  },
  ROUND_INIT_ERROR: (socket) => {
    console.error('Round initialization failed.')
    sendSocketMessage(socket, 'error', {
      message: 'Round initialization failed.',
      cause: 'ROUND_INIT_ERROR',
    })
  },
  GAME_ALREADY_IN_PROGRESS: (socket) => {
    console.error('Game already in progress in this room.')
    sendSocketMessage(socket, 'error', {
      message: 'Game already in progress in this room.',
      cause: 'GAME_ALREADY_IN_PROGRESS',
    })
  },
  GAME_CREATE_FAILED: (socket) => {
    console.error('Failed to create game.')
    sendSocketMessage(socket, 'error', {
      message: 'Failed to create game.',
      cause: 'GAME_CREATE_FAILED',
    })
  },
  ONLY_HOST_CAN_START_GAME: (socket) => {
    console.error('Only the host can start the game.')
    sendSocketMessage(socket, 'error', {
      message: 'Only the host can start the game.',
      cause: 'ONLY_HOST_CAN_START_GAME',
    })
  },
  CANVAS_NOT_FOUND: (socket) => {
    console.error('Canvas not found.')
    sendSocketMessage(socket, 'error', { message: 'Canvas not found.', cause: 'CANVAS_NOT_FOUND' })
  },
  CANVAS_CREATE_FAILED: (socket) => {
    console.error('Failed to create canvas.')
    sendSocketMessage(socket, 'error', {
      message: 'Failed to create canvas.',
      cause: 'CANVAS_CREATE_FAILED',
    })
  },
  CANVAS_NOT_ALLOWED: (socket) => {
    console.error('Not allowed to modify canvas.')
    sendSocketMessage(socket, 'error', {
      message: 'Not allowed to modify canvas.',
      cause: 'CANVAS_NOT_ALLOWED',
    })
  },
  INTERNAL_ERROR: (socket) => {
    console.error('An internal error occurred.')
    sendSocketMessage(socket, 'error', {
      message: 'An internal error occurred.',
      cause: 'INTERNAL_ERROR',
    })
  },
  NO_ACCESS_TO_PRIVATE_ROOM: (socket) => {
    console.error('No access to private room.')
    sendSocketMessage(socket, 'error', {
      message: 'No access to private room.',
      cause: 'NO_ACCESS_TO_PRIVATE_ROOM',
    })
  },
  ONLY_HOST_CAN_KICK: (socket) => {
    console.error('Only the host can kick players.')
    sendSocketMessage(socket, 'error', {
      message: 'Only the host can kick players.',
      cause: 'ONLY_HOST_CAN_KICK',
    })
  },
  ROOM_NOT_CONFIGURABLE: (socket) => {
    console.error('Room is currently not configurable.')
    sendSocketMessage(socket, 'error', {
      message: 'Room is currently not configurable.',
      cause: 'ROOM_NOT_CONFIGURABLE',
    })
  },
}
