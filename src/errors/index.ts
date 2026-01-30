/**
 * Custom error classes for centralized error handling
 */

/**
 * Base class for repository-level errors
 */
export class RepositoryError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RepositoryError'
    Object.setPrototypeOf(this, RepositoryError.prototype)
  }
}

/**
 * Error thrown when a room operation fails
 */
export class RoomError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RoomError'
    Object.setPrototypeOf(this, RoomError.prototype)
  }
}

/**
 * Error thrown when a game operation fails
 */
export class GameError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GameError'
    Object.setPrototypeOf(this, GameError.prototype)
  }
}

/**
 * Error thrown when a player operation fails
 */
export class PlayerError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PlayerError'
    Object.setPrototypeOf(this, PlayerError.prototype)
  }
}
