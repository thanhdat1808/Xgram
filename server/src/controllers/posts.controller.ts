import { Response } from 'express'
import { AddComment, CreatePostDto, EditComment, UpdatePostDto } from '@/dtos/posts.dto'
import { Post, Comment } from '@interfaces/posts.interface'
import { User } from '@interfaces/users.interface'
import userService from '@services/users.service'
import postService from '@services/posts.service'
import { resError, resSuccess } from '@/utils/custom-response'
import { statusCode } from '@/utils/statuscode'
import { RequestWithUser } from '@interfaces/auth.interface'

class PostsController {
  public userService = new userService()
  public postService = new postService()
  
    public getPostFollow = async (req: RequestWithUser, res: Response) => {
      try {
        const userId: string = req.user._id.valueOf()
        const findOnePostData: Post[] = await this.postService.getPostFollow(userId)
        resSuccess(res, findOnePostData, 'Get posts')
      } catch (error) {
        resError(res, error.message, error.code)
      }
    }

  public getPostById = async (req: RequestWithUser, res: Response) => {
    try {
      const postId: string = req.params.id
      const findOnePostData: Post = await this.postService.findPostById(postId)
      resSuccess(res, findOnePostData, 'finOne')
    } catch (error) {
      resError(res, error.message, error.code)
    }
  }

  public createPost = async (req: RequestWithUser, res: Response) => {
    try {
      const postData: CreatePostDto = {
        ...req.body,
        medias: req.files
      }
      const createPost = await this.postService.createPost(postData)
      resSuccess(res, createPost, 'created')
    } catch (error) {
      resError(res, error.message, error.code)
    }
  }

  public updatePost = async (req: RequestWithUser, res: Response) => {
    try {
      const postId: string = req.params.id
      const postData: UpdatePostDto = req.body
      const updatePostData: Post = await this.postService.updatePost(postId, postData)
      resSuccess(res, updatePostData, 'updated')
    } catch (error) {
      resError(res, error.message, error.code)
    }
  }

  public deletePost = async (req: RequestWithUser, res: Response) => {
    try {
      const postId: string = req.params.id
      const deletePostData: Post = await this.postService.deletePost(postId)
      resSuccess(res, deletePostData, 'deleted')
    } catch (error) {
      resError(res, error.message, error.code)
    }
  }

  public getCommentPost = async (req: RequestWithUser, res: Response) => {
    try {
      const postId: string = req.params.id
      const commentPost: Comment[] = await this.postService.getComment(postId)
      resSuccess(res, commentPost, '')
    } catch (error) {
      resError(res, error.message, error.code)
    }
  }

  public addCommentPost = async (req: RequestWithUser, res: Response) => {
    try {
      const dataComment: AddComment = req.body
      const addComment: Post = await this.postService.addComment(dataComment)
      return res.status(statusCode.OK).json({ data: addComment })
    } catch (error) {
      resError(res, error.message, error.code)
    }
  }

  public editCommentPost = async (req: RequestWithUser, res: Response) => {
    try {
      const postId: string = req.params.id
      const dataUpdate: EditComment = req.body
      const postUpdate: Post = await this.postService.editComment(postId, dataUpdate)
      return res.status(statusCode.OK).json({ data: postUpdate })
    } catch (error) {
      resError(res, error.message, error.code)
    }
  }

  public deleteCommentsPost = async (req: RequestWithUser, res: Response) => {
    try {
      const postId: string = req.body.id_post
      const commentId: string = req.body.id_comment
      const deleteCommentData: Post = await this.postService.deleteComment(postId, commentId)
      res.status(200).json({ data: deleteCommentData, message: 'deleted' })
    } catch (error) {
      resError(res, error.message, error.code)
    }
  }

  public reaction = async (req: RequestWithUser, res: Response) => {
    try {
      const postId: string = req.body.id_post
      const react_type: number = req.body.type
      const reacted_by: string = req.body.reacted_by
      const post: Post = await this.postService.reaction(postId, react_type, reacted_by)
      return res.status(statusCode.OK).json({ data: post })
    } catch (error) {
      resError(res, error.message, error.code)
    }
  }

  public unReaction = async (req: RequestWithUser, res: Response) => {
    try {
      const postId: string = req.body.id_post
      const reacted_by: string = req.body.reacted_by
      const postData: Post = await this.postService.unReaction(postId, reacted_by)
      res.status(200).json({ data: postData, message: 'Success' })
    } catch (error) {
      resError(res, error.message, error.code)
    }
  }

  public changeReaction = async (req: RequestWithUser, res: Response) => {
    try {
      const postId: string = req.params.id
      const type: number = req.body.type
      const reacted_by: string = req.body.reacted_by
      const changeReaction: Post = await this.postService.changeReaction(postId, type, reacted_by)
      res.status(200).json({ data: changeReaction, message: 'Success' })
    } catch (error) {
      resError(res, error.message, error.code)
    }
  }
}

export default PostsController
