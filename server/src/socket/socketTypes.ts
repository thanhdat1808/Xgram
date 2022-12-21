import { Socket } from 'socket.io'

type UserSocket = {
  user_id: string,
  socket: Socket
}
export type AppData = UserSocket[]

export const eventNames = ['seenMessage', 'sendMessage', 'newUserOnline', 'disconnect']
