import { WebSocket } from 'ws'
import { sendSocketMessage } from '../lib/socket'

export const errorHandlers = {
  PLAYER_NOT_FOUND: (socket: WebSocket) => {
    console.error('Player not found.')
    sendSocketMessage(socket, 'error', { code: 'PLAYER_NOT_FOUND', message: 'Player not found.' })
  },
  PLAYER_NOT_IN_ROOM: (socket: WebSocket) => {
    // Handle player not in room error
    console.error('Player is not in a room.')
    sendSocketMessage(socket, 'error', { code: 'PLAYER_NOT_IN_ROOM', message: 'Player is not in a room.' })
  },
  PLAYER_UNREGISTERED: (socket: WebSocket) => {
    console.error('Player is unregistered.')
    sendSocketMessage(socket, 'error', { code: 'PLAYER_UNREGISTERED', message: 'Player is unregistered.' })
  },
  ROOM_NOT_FOUND: (socket: WebSocket) => {
    console.error('Room not found.')
    sendSocketMessage(socket, 'error', { code: 'ROOM_NOT_FOUND', message: 'Room not found.' })
  },
  ROOM_CODE_ALREADY_EXISTS: (socket: WebSocket) => {
    console.error('Room code already exists.')
    sendSocketMessage(socket, 'error', { code: 'ROOM_CODE_ALREADY_EXISTS', message: 'Room code already exists.' })
  },
  ROOM_CREATE_FAILED: (socket: WebSocket) => {
    console.error('Failed to create room.')
    sendSocketMessage(socket, 'error', { code: 'ROOM_CREATE_FAILED', message: 'Failed to create room.' })
  },
  ROOM_ADD_PLAYER_FAILED: (socket: WebSocket) => {
    console.error('Adding player to room failed.')
    sendSocketMessage(socket, 'error', { code: 'ROOM_ADD_PLAYER_FAILED', message: 'Adding player to room failed.' })
  },
  ROOM_PLAYER_NOT_FOUND: (socket: WebSocket) => {
    console.error('Player not found in room.')
    sendSocketMessage(socket, 'error', { code: 'ROOM_PLAYER_NOT_FOUND', message: 'Player not found in room.' })
  },
  ROOM_HOST_NOT_FOUND: (socket: WebSocket) => {
    console.error('Room host not found.')
    sendSocketMessage(socket, 'error', { code: 'ROOM_HOST_NOT_FOUND', message: 'Room host not found.' })
  },
  ROOM_UPDATE_FAILED: (socket: WebSocket) => {
    console.error('Room update failed.')
    sendSocketMessage(socket, 'error', { code: 'ROOM_UPDATE_FAILED', message: 'Room update failed.' })
  },
  ONLY_HOST_CAN_CHANGE_SETTINGS: (socket: WebSocket) => {
    console.error('Only the host can change settings.')
    // send auth error to client
    sendSocketMessage(socket, 'error', { code: 'ONLY_HOST_CAN_CHANGE_SETTINGS', message: 'Only the host can change settings.' })
  },
  CUSTOM_WORD_VOTE_CLOSED: (socket: WebSocket) => {
    console.error('Custom word voting is closed.')
    sendSocketMessage(socket, 'error', { code: 'CUSTOM_WORD_VOTE_CLOSED', message: 'Custom word voting is closed.' })
  },
  INVALID_KEYWORD_EMPTY: (socket: WebSocket) => {
    console.error('Keyword cannot be empty or only whitespace.')
    sendSocketMessage(socket, 'error', { code: 'INVALID_KEYWORD_EMPTY', message: 'Keyword cannot be empty or only whitespace.' })
  },
  INVALID_KEYWORD_TOO_LONG: (socket: WebSocket) => {
    console.error('Keyword exceeds maximum length.')
    sendSocketMessage(socket, 'error', { code: 'INVALID_KEYWORD_TOO_LONG', message: 'Keyword exceeds maximum length of 50 characters.' })
  },
  GAME_NOT_FOUND: (socket: WebSocket) => {
    console.error('Game not found.')
    sendSocketMessage(socket, 'error', { code: 'GAME_NOT_FOUND', message: 'Game not found.' })
  },
  ROUND_INIT_ERROR: (socket: WebSocket) => {
    console.error('Round initialization failed.')
    sendSocketMessage(socket, 'error', { code: 'ROUND_INIT_ERROR', message: 'Round initialization failed.' })
  },
  GAME_ALREADY_IN_PROGRESS: (socket: WebSocket) => {
    console.error('Game already in progress in this room.')
    sendSocketMessage(socket, 'error', { code: 'GAME_ALREADY_IN_PROGRESS', message: 'Game already in progress in this room.' })
  },
  GAME_CREATE_FAILED: (socket: WebSocket) => {
    console.error('Failed to create game.')
    sendSocketMessage(socket, 'error', { code: 'GAME_CREATE_FAILED', message: 'Failed to create game.' })
  },
  ONLY_HOST_CAN_START_GAME: (socket: WebSocket) => {
    console.error('Only the host can start the game.')
    sendSocketMessage(socket, 'error', { code: 'ONLY_HOST_CAN_START_GAME', message: 'Only the host can start the game.' })
  },
  CANVAS_NOT_FOUND: (socket: WebSocket) => {
    console.error('Canvas not found.')
    sendSocketMessage(socket, 'error', { code: 'CANVAS_NOT_FOUND', message: 'Canvas not found.' })
  },
  CANVAS_CREATE_FAILED: (socket: WebSocket) => {
    console.error('Failed to create canvas.')
    sendSocketMessage(socket, 'error', { code: 'CANVAS_CREATE_FAILED', message: 'Failed to create canvas.' })
  },
  CANVAS_NOT_ALLOWED: (socket: WebSocket) => {
    console.error('Not allowed to modify canvas.')
    sendSocketMessage(socket, 'error', { code: 'CANVAS_NOT_ALLOWED', message: 'Not allowed to modify canvas.' })
  },
  INTERNAL_ERROR: (socket: WebSocket) => {
    // Handle internal server error
    console.error('An internal error occurred.')
    sendSocketMessage(socket, 'error', { code: 'INTERNAL_ERROR', message: 'An internal error occurred.' })
  },
}
