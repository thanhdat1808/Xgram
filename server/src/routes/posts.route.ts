import { Router } from 'express';
import PostsController from '@/controllers/posts.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class PostsRoute implements Routes {
  public path = '/posts';
  public router = Router();
  public postsController = new PostsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.get(`${this.path}`, this.usersController.getUsers);
    // this.router.get(`${this.path}/:id`, this.usersController.getUserById);
    this.router.post(`${this.path}`, this.postsController.createPost);
    // this.router.put(`${this.path}/:id`, validationMiddleware(CreateUserDto, 'body', true), this.usersController.updateUser);
    // this.router.delete(`${this.path}/:id`, this.usersController.deleteUser);
  }
}

export default PostsRoute;
