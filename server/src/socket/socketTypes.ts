import { Socket } from 'socket.io'

type UserSocket = {
  user_id: string,
  socket: Socket
}
export type AppData = UserSocket[]
