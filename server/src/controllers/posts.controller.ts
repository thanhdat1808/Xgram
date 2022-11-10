import { NextFunction, Request, Response } from 'express'
import { AddComment, CreatePostDto, EditComment, UpdatePostDto } from '@/dtos/posts.dto'
import { Post, Comment } from '@interfaces/posts.interface'
import { User } from '@interfaces/users.interface'
import userService from '@services/users.service'
import postService from '@services/posts.service'
import { statusCode } from '@/utils/statuscode'

class PostsController {
  public userService = new userService()
  public postService = new postService()

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: User[] = await this.userService.findAllUser()

      res.status(200).json({ data: findAllUsersData, message: 'findAll' })
    } catch (error) {
      next(error)
    }
  }

  public getPostById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId: string = req.params.id
      const findOnePostData: Post = await this.postService.findPostById(postId)

      res.status(200).json({ data: findOnePostData, message: 'findOne' })
    } catch (error) {
      next(error)
    }
  }

  public createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postData: CreatePostDto = {
        ...req.body,
        medias: req.files
      }
      const createPost = await this.postService.createPost(postData)
      return res.send(createPost)
    } catch (error) {
      next(error)
    }
  }

  public updatePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId: string = req.params.id
      const postData: UpdatePostDto = req.body
      const newMedias = req.files as Express.Multer.File[]

      const updatePostData: Post = await this.postService.updatePost(postId, postData, newMedias)
      res.status(200).json({ data: updatePostData, message: 'updated' })
    } catch (error) {
      next(error)
    }
  }

  public deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId: string = req.params.id
      const deletePostData: Post = await this.postService.deletePost(postId)
      res.status(200).json({ data: deletePostData, message: 'deleted' })
    } catch (error) {
      next(error)
    }
  }

  public getCommentPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId: string = req.params.id
      const commentPost: Comment[] = await this.postService.getComment(postId)
      res.status(statusCode.OK).json({ data: commentPost })
    } catch (error) {
      next(error)
    }
  }

  public addCommentPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataComment: AddComment = req.body
      const addComment: Post = await this.postService.addComment(dataComment)
      return res.status(statusCode.OK).json({ data: addComment })
    } catch (error) {
      next(error)
    }
  }

  public editCommentPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId: string = req.params.id
      const dataUpdate: EditComment = req.body
      const postUpdate: Post = await this.postService.editComment(postId, dataUpdate)
      return res.status(statusCode.OK).json({ data: postUpdate })
    } catch (error) {
      next(error)
    }
  }

  public deleteCommentsPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId: string = req.body.id_post
      const commentId: string = req.body.id_comment
      const deleteCommentData: Post = await this.postService.deleteComment(postId, commentId)
      res.status(200).json({ data: deleteCommentData, message: 'deleted' })
    } catch (error) {
      next(error)
    }
  }
}

export default PostsController
