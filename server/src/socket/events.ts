import { MessageFormatInterface, SendMessage } from '@/interfaces/messages.interface'
import { User } from '@/interfaces/users.interface'
import userModel from '@/models/users.model'
import { Server, Socket } from 'socket.io'
import { AppData } from './socketTypes'
import ConversationService from '@/services/conversations.service'
import { CreateMessage } from '@/interfaces/messages.interface'
import { formatMessage } from '@/utils/formatData'

const conversations = new ConversationService()
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
  app.push({user_id: data.id, socket: socket})
  const infoUser: User = await userModel.findById(data.id)
  const friends: string[] = infoUser.followers.filter(user => infoUser.following.includes(user))
  const sockets = []
  app.forEach(user => {
    if(friends.includes(user.user_id)) sockets.push(user.user_id)
  })
  io.to(sockets).emit('newUserOnline', {socket: socket.id, user: infoUser})
}
const sendMessage = (app: AppData, socket: Socket, io: Server) => async (data: SendMessage) => {
  let dataMessage: CreateMessage
  try {
    if(!data.conversation_id) {
      const createConversation = await conversations.createConversation({
        last_message: '',
        user: [data.sent_by, data.sent_to]
      })
      dataMessage = {
        conversation_id: createConversation._id,
        ...data,
        status: 1,
        post: data.type === 'post' ? data.message : null,
        story: data.type === 'story' ? data.message : null
      }
    }
    else {
      dataMessage = {
        ...data,
        status: 1,
        post: data.type === 'post' ? data.message : null,
        story: data.type === 'story' ? data.message : null
      }
    }
    const message: MessageFormatInterface = await conversations.createMessage(dataMessage)
    await conversations.updateConversation(message.conversation_id, message._id)
    io.to(socket.id).emit('sendMessage', {
      message : formatMessage(message)
    })
  } catch (error) {
    
  }
}
const disconnect = (app, socket, io) => () => {
  delete app.allRooms[socket.roomId].users[socket.userId]
  io.to(socket.roomId).emit('userdisconnect', app.allRooms[socket.roomId].users)
}
const clear = (app, socket, io) => () => {
  io.to(socket.roomId).emit('clear','')
}
export default events
