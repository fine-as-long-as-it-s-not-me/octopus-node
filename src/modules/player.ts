class Player {
  id: string
  name: string
  ws: WebSocket

  constructor(id: string, name: string, ws: WebSocket) {
    this.id = id
    this.name = name
    this.ws = ws
  }
}

export { Player }
