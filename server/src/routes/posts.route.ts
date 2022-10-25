import { Router } from 'express';
import PostsController from '@/controllers/posts.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { CreatePostDto } from '@/dtos/posts.dto';
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'

class PostsRoute implements Routes {
  public path = '/posts';
  public router = Router();
  public postsController = new PostsController();
  public str = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
      const extension = file.mimetype.split('/')[1]
      cb(null, uuidv4() + '.' + extension)
    }
  })
  public upload = multer({ storage: this.str })
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    // this.router.get(`${this.path}`, this.usersController.getUsers);
    this.router.get(`${this.path}/:id`, this.postsController.getPostById);
    this.router.post(`${this.path}`, validationMiddleware(CreatePostDto, 'body', true), this.upload.array('medias'), this.postsController.createPost);
    // this.router.put(`${this.path}/:id`, validationMiddleware(CreateUserDto, 'body', true), this.usersController.updateUser);
    this.router.delete(`${this.path}/:id`, this.postsController.deletePost)
  }
}

export default PostsRoute;
