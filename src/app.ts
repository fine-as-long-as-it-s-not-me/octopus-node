import express from 'express'
import http from 'http'
import { WebSocketServer } from 'ws'
import { errorHandlers, handlers } from './ws'

const app = express()
const server = http.createServer(app)
const wss = new WebSocketServer({ server })

const PORT = Number(process.env.PORT) || 8080
server.listen(PORT)

app.get('/', (req, res) => {
  res.send('WebSocket server is running.')
})

wss.on('connection', (socket) => {
  console.log('New client connected')
  socket.on('message', (rawMessage) => {
    try {
      const { mainType, subType, data } = JSON.parse(rawMessage.toString())

      console.log(`Received message: ${mainType} - ${subType}`, data)

      handlers[mainType][subType](socket, data)
    } catch (error) {
      console.error('Error handling message:', error)
      if (error instanceof Error) {
        const cause = (error.cause as keyof typeof errorHandlers) || 'INTERNAL_ERROR'
        const handler = errorHandlers[cause] ?? errorHandlers.INTERNAL_ERROR
        handler(socket)
      }
    }
  })
})
