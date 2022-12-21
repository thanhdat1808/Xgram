import { MessageFormatInterface, SendMessage } from '@/interfaces/messages.interface'
import { User } from '@/interfaces/users.interface'
import userModel from '@/models/users.model'
import { Server, Socket } from 'socket.io'
import { AppData } from './socketTypes'
import ConversationService from '@/services/conversations.service'
import UserService from '@/services/users.service'
import { CreateMessage } from '@/interfaces/messages.interface'
import { formatMessage, formatUser } from '@/utils/formatData'

const conversations = new ConversationService()
const users = new UserService
const events = (app: AppData, socket: Socket, io: Server) => {
  
  const handler = {
    onlineUsers: onlineUsers(app, socket, io),
    sendMessage: sendMessage(app, socket, io),
    disconnect: disconnect(app, socket, io),
    seenMessage: seenMessage(app, socket, io)
  }
  return handler
}

const findSocket = (app: AppData, userId: string) => {
  const index = app.findIndex(user => user.user_id === userId)
  return app[index].socket
}

const updateStatusUser = async (sockets: string[], user: User, io: Server) => {
  sockets.forEach(socket => {
    io.to(socket).emit('updateStatusUser', {socket: socket, user: formatUser(user)})
  })
}

// Events
const onlineUsers = (app: AppData, socket: Socket, io: Server) => async (data: {id: string}) => {
  try {
    console.log('Online users...')
    app.push({user_id: data.id, socket: socket})
    console.log(app)
    const infoUser: User = await users.findUserById(data.id)
    if(!infoUser) return
    const friends: string[] = infoUser.followers
    const sockets = [socket.id]
    app.forEach(user => {
      if(friends.includes(user.user_id)) sockets.push(user.socket.id)
    })
    updateStatusUser(sockets, infoUser, io)
  } catch (error) {
    console.log({error})
  }
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
    
    io.to(findSocket(app, data.sent_to).id).emit('sendMessage', {
      message : formatMessage(message)
    })
  } catch (error) {
    
  }
}
const seenMessage = (app: AppData, socket: Socket, io: Server) => async (data: {conversation_id: string, user_id: string}) => {
  try {
    const updateSeen = await conversations.updateStatusMessage(data.conversation_id, 2)
    io.to(findSocket(app, data.user_id).id).emit('seenMessage', {
      message: formatMessage(updateSeen)
    })
  } catch (error) {
    
  }
}
const disconnect = (app, socket, io) => () => {
  console.log('Disconnect...')
}
export default events
