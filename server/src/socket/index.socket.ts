import { Server, Socket } from 'socket.io'
import events from './events'
import { AppData } from './socketTypes'

export const app: AppData = []
export default (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('Connection...')
    const eventHandlers = [
      events(app, socket, io)
    ]
    // Bind events to handlers
    eventHandlers.forEach(handler => {
      for (const eventName in handler) {
        socket.on(eventName, handler[eventName])
      }
    })
  })
}
