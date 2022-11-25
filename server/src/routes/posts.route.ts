import { Router } from 'express'
import PostsController from '@/controllers/posts.controller'
import { Routes } from '@interfaces/routes.interface'
import authMiddleware from '@middlewares/auth.middleware'
import validationMiddleware from '@middlewares/validation.middleware'
import { AddComment, CreatePostDto, DeleteComment, EditComment, Reaction, UnReaction } from '@/dtos/posts.dto'

class PostsRoute implements Routes {
  public path = '/posts'
  public router = Router()
  public postsController = new PostsController()
  constructor() {
    this.initializeRoutes()
  }
  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.postsController.getPostFollow)
    this.router.get(`${this.path}/:id`, authMiddleware, this.postsController.getPostById)
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreatePostDto, 'body', true), this.postsController.createPost)
    this.router.post(`${this.path}/:id`, authMiddleware, validationMiddleware(CreatePostDto, 'body', true), this.postsController.updatePost)
    this.router.delete(`${this.path}/:id`, authMiddleware, this.postsController.deletePost)
    this.router.get(`${this.path}/comments/:id`, authMiddleware, this.postsController.getCommentPost)
    this.router.post(`${this.path}/comments/create`, authMiddleware, validationMiddleware(AddComment, 'body'), this.postsController.addCommentPost)
    this.router.post(`${this.path}/comments/:id`, authMiddleware, validationMiddleware(EditComment, 'body'), this.postsController.editCommentPost)
    this.router.post(`${this.path}/comments/delete`, authMiddleware, validationMiddleware(DeleteComment, 'body'), this.postsController.deleteCommentsPost)
    this.router.post(`${this.path}/reaction/like`, authMiddleware, validationMiddleware(Reaction, 'body'), this.postsController.reaction)
    this.router.post(`${this.path}/reaction/unlike`, authMiddleware, validationMiddleware(UnReaction, 'body'), this.postsController.unReaction)
    this.router.post(`${this.path}/reaction/change`, authMiddleware, validationMiddleware(UnReaction, 'body'), this.postsController.unReaction)
  }
}

export default PostsRoute
