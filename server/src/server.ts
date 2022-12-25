import App from '@/app'
import AuthRoute from '@routes/auth.route'
import IndexRoute from '@routes/index.route'
import UsersRoute from '@routes/users.route'
import PostsRoute from '@routes/posts.route'
import validateEnv from '@utils/validateEnv'
import UploadsRoute from '@routes/upload.route'
import StoriesRoute from '@routes/stories.route'
import ConversationsRouter from '@routes/conversations.route'
import NotificationsRouter from '@routes/notifications.router'
import { Server } from 'socket.io'
import { createServer } from 'http'
import { logger } from './utils/logger'
import { NODE_ENV, PORT } from './config'
import socketHandler from './socket/index.socket'

validateEnv()

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new PostsRoute(), new UploadsRoute(), new StoriesRoute(), new ConversationsRouter(), new NotificationsRouter()])

const server = createServer(app.app)
export const io = new Server(server, {
  cors: {
    origin: '*'
  }
})
socketHandler(io)

server.listen(PORT, () => {
  logger.info('=================================')
  logger.info(`======= ENV: ${NODE_ENV} =======`)
  logger.info(`🚀 App listening on the port ${PORT}`)
  logger.info('=================================')
})
