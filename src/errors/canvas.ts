export const CANVAS_NOT_FOUND_ERROR = new Error('Canvas not found', {
  cause: 'CANVAS_NOT_FOUND',
})

export const CANVAS_CREATE_FAILED_ERROR = new Error('Failed to create canvas', {
  cause: 'CANVAS_CREATE_FAILED',
})

export const CANVAS_NOT_ALLOWED_ERROR = new Error('Not allowed to modify canvas', {
  cause: 'CANVAS_NOT_ALLOWED',
})
