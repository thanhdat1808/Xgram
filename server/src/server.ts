import App from '@/app'
import AuthRoute from '@routes/auth.route'
import IndexRoute from '@routes/index.route'
import UsersRoute from '@routes/users.route'
import PostsRoute from '@routes/posts.route'
import validateEnv from '@utils/validateEnv'
import UploadsRoute from '@routes/upload.route'

validateEnv()

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new PostsRoute(), new UploadsRoute()])

app.listen()
