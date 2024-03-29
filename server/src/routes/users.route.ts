import { Router } from 'express'
import UsersController from '@controllers/users.controller'
import { PasswordDto } from '@dtos/users.dto'
import { Routes } from '@interfaces/routes.interface'
import validationMiddleware from '@middlewares/validation.middleware'
import authMiddleware from '@middlewares/auth.middleware'
class UsersRoute implements Routes {
  public path = '/users'
  public router = Router()
  public usersController = new UsersController()
  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.usersController.getUsers)
    this.router.get(`${this.path}/:id`, authMiddleware, this.usersController.getUserById)
    this.router.get(`${this.path}/:id/posts`, authMiddleware, this.usersController.getProfilePost)
    this.router.post(`${this.path}`, authMiddleware, this.usersController.updateUser)
    this.router.delete(`${this.path}/:id`, authMiddleware, this.usersController.deleteUser)
    this.router.post(`${this.path}/follow/:id`, authMiddleware, this.usersController.followUser)
    this.router.post(`${this.path}/unfollow/:id`, authMiddleware, this.usersController.unFollowUser)
    this.router.post(`${this.path}/removefollow/:id`, authMiddleware, this.usersController.followUser)
    this.router.post(`${this.path}/password`, authMiddleware, validationMiddleware(PasswordDto, 'body'), this.usersController.updatePassword)
    this.router.get(`${this.path}/blocked-users`, authMiddleware, this.usersController.getBlockUser)
    this.router.post(`${this.path}/blocked-users/:id`, authMiddleware, this.usersController.blockUser)
    this.router.post(`${this.path}/blocked-users/:id/unblock`, authMiddleware, this.usersController.unBlockUser)
    this.router.get(`/search${this.path}`, authMiddleware, this.usersController.searchUsers)
  }
}

export default UsersRoute
