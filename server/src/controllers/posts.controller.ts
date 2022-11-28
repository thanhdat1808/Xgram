import { Response } from 'express'
import { AddComment, CreatePostDto, EditComment, UpdatePostDto } from '@/dtos/posts.dto'
import { Post, PostFormat, CommentFormat } from '@interfaces/posts.interface'
import userService from '@services/users.service'
import postService from '@services/posts.service'
import { resError, resSuccess } from '@/utils/custom-response'
import { RequestWithUser } from '@interfaces/auth.interface'
import { formatComment, formatPost } from '@/utils/formatData'

class PostsController {
  public userService = new userService()
  public postService = new postService()
  
    public getPostFollow = async (req: RequestWithUser, res: Response) => {
      try {
        const userId: string = req.user._id.valueOf()
        const findOnePostData: PostFormat[] = await this.postService.getPostFollow(userId)
        resSuccess(res, findOnePostData.map(post => formatPost(post)), 'Get posts')
      } catch (error) {
        resError(res, error.message, error.code)
      }
    }

  public getPostById = async (req: RequestWithUser, res: Response) => {
    try {
      const postId: string = req.params.id
      const findOnePostData: PostFormat = await this.postService.findPostById(postId)
      resSuccess(res, formatPost(findOnePostData), 'finOne')
    } catch (error) {
      resError(res, error.message, error.code)
    }
  }

  public createPost = async (req: RequestWithUser, res: Response) => {
    try {
      const postData: CreatePostDto = {
        ...req.body,
        posted_by: req.user._id
      }
      const createPost: PostFormat = await this.postService.createPost(postData)
      resSuccess(res, formatPost(createPost), 'created')
    } catch (error) {
      resError(res, error.message, error.code)
    }
  }

  public updatePost = async (req: RequestWithUser, res: Response) => {
    try {
      const postId: string = req.params.id
      const postData: UpdatePostDto = req.body
      const updatePostData: PostFormat = await this.postService.updatePost(postId, postData)
      resSuccess(res, formatPost(updatePostData as unknown as PostFormat), 'updated')
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
      const commentPost: CommentFormat[] = await this.postService.getComment(postId)
      resSuccess(res, commentPost.map(comment => formatComment(comment)), 'Get comment')
    } catch (error) {
      resError(res, error.message, error.code)
    }
  }

  public addCommentPost = async (req: RequestWithUser, res: Response) => {
    try {
      const dataComment: AddComment = req.body
      const addComment: PostFormat = await this.postService.addComment(dataComment)
      resSuccess(res, formatPost(addComment), 'Add success')
    } catch (error) {
      resError(res, error.message, error.code)
    }
  }

  public editCommentPost = async (req: RequestWithUser, res: Response) => {
    try {
      const postId: string = req.params.post_id
      const commentId: string = req.params.comment_id
      const dataUpdate: EditComment = req.body
      const postUpdate: PostFormat = await this.postService.editComment(postId, commentId, dataUpdate)
      resSuccess(res, formatPost(postUpdate), 'Update')
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
      const post: PostFormat = await this.postService.reaction(postId, react_type, reacted_by)
      resSuccess(res, formatPost(post), 'Success')
    } catch (error) {
      resError(res, error.message, error.code)
    }
  }

  public unReaction = async (req: RequestWithUser, res: Response) => {
    try {
      const postId: string = req.body.id_post
      const reacted_by: string = req.body.reacted_by
      const postData: PostFormat = await this.postService.unReaction(postId, reacted_by)
      resSuccess(res, formatPost(postData), 'un reaction')
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
