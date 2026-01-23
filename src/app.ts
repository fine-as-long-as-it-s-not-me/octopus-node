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
    try {
      const { mainType, subType, data } = JSON.parse(rawMessage.toString())

      console.log(
        `Received message: mainType=${mainType}, subType=${subType}, data=${JSON.stringify(data)}`,
      )

      handlers[mainType][subType](socket, data)
    } catch (error) {
      console.error('Error handling message:', error)
    }
  })
})
