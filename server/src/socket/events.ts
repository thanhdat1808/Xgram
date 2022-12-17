import { User } from '@/interfaces/users.interface'
import userModel from '@/models/users.model'
import { Server, Socket } from 'socket.io'
import { AppData } from './socketTypes'

const events = (app: AppData, socket: Socket, io: Server) => {
  
  const handler = {
    onlineUsers: onlineUsers(app, socket, io),
    clear : clear(app, socket, io),
    sendMessage : sendMessage(app, socket, io),
    disconnect : disconnect(app, socket, io)
  }
  return handler
}

// Events
const onlineUsers = (app: AppData, socket: Socket, io: Server) => async (data: {id: string}) => {
  app.allUsers.push({user_id: data.id, socket: socket})
  const infoUser: User = await userModel.findById(data.id)
  const friends: string[] = infoUser.followers.filter(user => infoUser.following.includes(user))
  const sockets = []
  app.allUsers.forEach(user => {
    if(friends.includes(user.user_id)) sockets.push(user.user_id)
  })
  io.to(sockets).emit('newUserOnline', {socket: socket.id, user: infoUser})
}
const sendMessage = (app, socket, io) => (data) => {
  io.to(socket.roomId).emit('sendMessage', {
    name : socket.userName,
    message : data
  })
}
const disconnect = (app, socket, io) => () => {
  delete app.allRooms[socket.roomId].users[socket.userId]
  io.to(socket.roomId).emit('userdisconnect', app.allRooms[socket.roomId].users)
}
const clear = (app, socket, io) => () => {
  io.to(socket.roomId).emit('clear','')
}
export default events
