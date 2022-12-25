import { UserFormat } from '@/interfaces/users.interface'
import { Socket } from 'socket.io'

type UserSocket = {
  user: UserFormat,
  socket: Socket
}
export type AppData = UserSocket[]
