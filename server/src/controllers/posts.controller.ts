import { NextFunction, Request, Response } from 'express';
import { CreatePostDto } from '@/dtos/posts.dto';
import { Post } from '@interfaces/posts.interface';
import { User } from '@interfaces/users.interface';
import userService from '@services/users.service';
import postService from '@services/posts.service';

class PostsController {
  public userService = new userService();
  public postService = new postService();

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: User[] = await this.userService.findAllUser();

      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getPostById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId: string = req.params.id;
      const findOnePostData: Post = await this.postService.findPostById(postId);

      res.status(200).json({ data: findOnePostData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createPost = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
    try {
      const postData: CreatePostDto = {
        ...req.body,
        medias: req.files
      }
      console.log('111111', postData)
      const createPost = await this.postService.createPost(postData)
      return res.send(createPost)
    } catch (error) {
      next(error);
    }
  };

  public updatePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId: string = req.params.id;
      const postData: CreatePostDto = req.body;
      const newMedias = req.files as Express.Multer.File[]

      const updatePostData: Post = await this.postService.updatePost(postId, postData, newMedias);
      res.status(200).json({ data: updatePostData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId: string = req.params.id;
      const deleteUserData: Post = await this.postService.deletePost(postId);

      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default PostsController;
