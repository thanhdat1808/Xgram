import { Router } from 'express'
import PostsController from '@/controllers/posts.controller'
import { Routes } from '@interfaces/routes.interface'
import authMiddleware from '@middlewares/auth.middleware'
import validationMiddleware from '@middlewares/validation.middleware'
import { AddComment, CreatePostDto, EditComment } from '@/dtos/posts.dto'

class PostsRoute implements Routes {
  public path = '/posts'
  public router = Router()
  public postsController = new PostsController()
  constructor() {
    this.initializeRoutes()
  }
  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.postsController.getHomePost)
    this.router.get(`${this.path}/:id`, authMiddleware, this.postsController.getPostDetail)
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreatePostDto, 'body', true), this.postsController.createPost)
    this.router.post(`${this.path}/:id`, authMiddleware, this.postsController.updatePost)
    this.router.delete(`${this.path}/:id`, authMiddleware, this.postsController.deletePost)
    this.router.get(`${this.path}/:id/comments`, authMiddleware, this.postsController.getCommentPost)
    this.router.post(`${this.path}/:id/comments`, authMiddleware, validationMiddleware(AddComment, 'body'), this.postsController.addCommentPost)
    this.router.post(`${this.path}/:post_id/comments/:comment_id`, authMiddleware, validationMiddleware(EditComment, 'body'), this.postsController.editCommentPost)
    this.router.delete(`${this.path}/:post_id/comments/:comment_id`, authMiddleware, this.postsController.deleteCommentsPost)
    this.router.post(`${this.path}/:id/like`, authMiddleware, this.postsController.reaction)
    this.router.post(`${this.path}/:id/unlike`, authMiddleware, this.postsController.unReaction)
    this.router.get(`/search${this.path}`, authMiddleware, this.postsController.search)
  }
}

export default PostsRoute
