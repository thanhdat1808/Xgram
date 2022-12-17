import { Server, Socket } from 'socket.io'
import events from './events'
import { AppData } from './socketTypes'
const app: AppData = {
  allSockets: [],
  allUsers : []
}

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

    // Keep track of the socket
    app.allSockets.push(socket)
  })
}
