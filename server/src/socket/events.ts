import { MessageFormatInterface, SendMessage } from '@/interfaces/messages.interface'
import { User, UserFormat } from '@/interfaces/users.interface'
import { Server, Socket } from 'socket.io'
import { AppData } from './socketTypes'
import ConversationService from '@/services/conversations.service'
import UserService from '@/services/users.service'
import { CreateMessage } from '@/interfaces/messages.interface'
import { formatMessage } from '@/utils/formatData'
import { MessageStatus } from '@/utils/statuscode'
import { formatRes } from '@/utils/custom-response'

const conversations = new ConversationService()
const users = new UserService
const events = (app: AppData, socket: Socket, io: Server) => {
  const handler = {
    onConnection: onConnection(app, socket, io),
    sendMessage: sendMessage(app, socket, io),
    disconnect: disconnect(app, socket, io),
    seenMessage: seenMessage(app, socket, io)
  }
  return handler
}

const checkExistUser = (app: AppData, userId: string) => {
  const index = app.findIndex(user => user.user._id.valueOf() === userId)
  return index
}
export const findSocket = (app: AppData, userId: string) => {
  const index = app.findIndex(user => user.user._id.valueOf() === userId)
  if(index!==-1) return app[index].socket
  return
}
const getFriends = (user: UserFormat) => {
  const friends: User[] = []
  user.followers.forEach(follower => {
    user.following.forEach(following => {
      if(follower._id.valueOf() === following._id.valueOf()) friends.push(follower)
    })
  })
  return friends
}
const getSocketFriends = (app: AppData, friends: User[]) => {
  const friendOnlines: string[] = []
  const sockets = []
  app.forEach(user => {
    friends.forEach(element => {
      if(user.user._id.valueOf() === element._id.valueOf()) {
        sockets.push(user.socket.id)
        friendOnlines.push(element._id)
      }
    })
  })
  return {friendOnlines, sockets}
}
const newUserOnline = (sockets: string[], userId: string, io: Server) => {
  console.log('New user online')
  sockets.forEach(socket => {
    io.to(socket).emit('userConnected', userId)
  })
  return
}
const updateStatus = (sockets: string[], userId: string, io: Server) => {
  console.log('User offline', sockets)
  sockets.forEach(socket => {
    io.to(socket).emit('userDisconnected', userId)
  })
  return
}
export const sendNotification = (app: AppData, userId: string, data: object, io: Server) => {
  const targetSocket = findSocket(app, userId)
  if(targetSocket) io.to(targetSocket.id).emit('newNotification', data)
}

// Events
const onConnection = (app: AppData, socket: Socket, io: Server) => async (data: {id: string}) => {
  try {
    const user: UserFormat = await users.findUserById(data.id)
    if(checkExistUser(app, data.id) !== -1) {
      const friends: User[] = getFriends(user)
      const {friendOnlines} = getSocketFriends(app, friends)
      socket.emit('getUserOnline', friendOnlines)
    }
    else{
      const friends: User[] = getFriends(user)
      const {friendOnlines, sockets} = getSocketFriends(app, friends)
      newUserOnline(sockets, user._id, io)
      socket.emit('getUserOnline', friendOnlines)
      app.push({user, socket})
    }
  } catch (error) {
    socket.emit('error', error)
  }
}
const sendMessage = (app: AppData, socket: Socket, io: Server) => async (data: SendMessage, callback) => {
  console.log('Send message', data)
  let dataMessage: CreateMessage
  try {
    if(!data.conversation_id) {
      console.log('Create conversation')
      const createConversation = await conversations.createConversation(data.sent_by,{
        user: [data.sent_by, data.sent_to]
      })
      dataMessage = {
        conversation_id: createConversation._id.valueOf(),
        message: data.message,
        type: data.type,
        sent_by: data.sent_by,
        sent_to: data.sent_to,
        status: MessageStatus.SENT,
        post: data.type === 'post' ? data.ref_id : null,
        story: data.type === 'story' ? data.ref_id : null
      }
    }
    else {
      console.log('Update conversation')
      dataMessage = {
        conversation_id: data.conversation_id,
        message: data.message,
        type: data.type,
        sent_by: data.sent_by,
        sent_to: data.sent_to,
        status: MessageStatus.SENT,
        post: data.type === 'post' ? data.ref_id : null,
        story: data.type === 'story' ? data.ref_id : null
      }
    }
    console.log({dataMessage})
    const createMessage: MessageFormatInterface = await conversations.createMessage(dataMessage)
    await conversations.updateConversation(createMessage.conversation_id, createMessage._id)
    const message = formatMessage(createMessage)
    if(callback) callback(formatRes(message, 'OK'))
    const targetSocket = findSocket(app, data.sent_to)
    if(targetSocket) io.to(targetSocket.id).emit('sendMessage', message)
  } catch (error) {
    console.log(error)
    if(callback) callback(formatRes(null, 'ERROR'))
  }
}
const seenMessage = (app: AppData, socket: Socket, io: Server) => async (data: {message_id: string, user_id: string}) => {
  try {
    const updateSeen = await conversations.updateStatusMessage(data.message_id, MessageStatus.READ)
    io.to(findSocket(app, data.user_id).id).emit('seenMessage', {
      message: formatMessage(updateSeen)
    })
  } catch (error) {
    
  }
}
const disconnect = (app: AppData, socket: Socket, io: Server) => () => {
  console.log('Disconnect...')
  app.forEach((user, index) => {
    if(user.socket.id === socket.id) {
      const friends: User[] = getFriends(user.user)
      const {sockets} = getSocketFriends(app, friends)
      updateStatus(sockets, user.user._id, io)
      app.splice(index, 1)
    }
  })
}
export default events
