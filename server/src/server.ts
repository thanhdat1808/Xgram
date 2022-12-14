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

validateEnv()

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new PostsRoute(), new UploadsRoute(), new StoriesRoute(), new ConversationsRouter(), new NotificationsRouter()])

app.listen()
