import express from 'express'
import http from 'http'
import { WebSocketServer } from 'ws'
import { handlers } from './ws'

const app = express()
const server = http.createServer(app)
const wss = new WebSocketServer({ server })

const PORT = Number(process.env.PORT) || 8080
server.listen(PORT)

app.get('/', (req, res) => {
  res.send('WebSocket server is running.')
})

wss.on('connection', (socket) => {
  socket.on('message', (rawMessage) => {
    let payload

    try {
      payload = JSON.parse(rawMessage.toString())
    } catch {
      console.error('Invalid JSON:', rawMessage)
      return
    }

    const { mainType, subType, data } = payload

    const mainHandler = handlers[mainType]
    if (!mainHandler) {
      console.warn('Unknown mainType:', mainType)
      return
    }

    const subHandler = mainHandler[subType]
    if (!subHandler) {
      console.warn(`Unknown subtype: ${mainType}.${subType}`)
      return
    }

    subHandler(socket, data)
  })
})
