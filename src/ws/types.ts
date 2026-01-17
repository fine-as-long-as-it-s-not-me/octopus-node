import { WebSocket } from 'ws'

export type WSHandler = (socket: WebSocket, data: any) => void

export type SubTypeHandlerMap<T extends Record<string, unknown> = Record<string, unknown>> = {
  [K in keyof T]: WSHandler
}

export type MainTypeHandlerMap<
  T extends Record<string, SubTypeHandlerMap> = Record<string, SubTypeHandlerMap>,
> = T
