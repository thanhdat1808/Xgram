import { Response } from 'express'
import { CreatePostDto, UpdatePostDto } from '@/dtos/posts.dto'
import { Post, PostFormat, CommentFormat } from '@interfaces/posts.interface'
import userService from '@services/users.service'
import postService from '@services/posts.service'
import { resError, resSuccess } from '@/utils/custom-response'
import { RequestWithUser } from '@interfaces/auth.interface'
import { formatComment, formatPost } from '@/utils/formatData'
import { statusCode } from '@/utils/statuscode'

class PostsController {
  public userService = new userService()
  public postService = new postService()
  
    public getHomePost = async (req: RequestWithUser, res: Response) => {
      try {
        const userId: string = req.user._id.valueOf()
        const page: string = req.query.page as string || '1'
        const findOnePostData: PostFormat[] = await this.postService.getHomePost(userId, page)
        const data = findOnePostData.length > 0 ? findOnePostData.map(post => formatPost(post)) : []
        resSuccess(res, data, 'Get posts')
      } catch (error) {
        resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
      }
    }

  public getPostDetail = async (req: RequestWithUser, res: Response) => {
    try {
      const userId: string = req.user._id.valueOf()
      const postId: string = req.params.id
      const findOnePostData: PostFormat = await this.postService.getPostDetail(userId, postId)
      const data = findOnePostData ? formatPost(findOnePostData) : {}
      resSuccess(res, data, 'finOne')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public createPost = async (req: RequestWithUser, res: Response) => {
    try {
      const postData: CreatePostDto = {
        ...req.body,
        posted_by: req.user._id.valueOf()
      }
      const createPost: PostFormat = await this.postService.createPost(postData)
      resSuccess(res, formatPost(createPost), 'created')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public updatePost = async (req: RequestWithUser, res: Response) => {
    try {
      const postId: string = req.params.id
      const postData: UpdatePostDto = req.body
      const updatePostData: PostFormat = await this.postService.updatePost(postId, postData)
      resSuccess(res, formatPost(updatePostData), 'updated')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public deletePost = async (req: RequestWithUser, res: Response) => {
    try {
      const postId: string = req.params.id
      const deletePostData: Post = await this.postService.deletePost(postId)
      resSuccess(res, deletePostData, 'deleted')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public getCommentPost = async (req: RequestWithUser, res: Response) => {
    try {
      const postId: string = req.params.id
      const commentPost: CommentFormat[] = await this.postService.getComment(postId)
      const data = commentPost.length > 0 ? commentPost.map(comment => formatComment(comment)) : []
      resSuccess(res, data, 'Get comment')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public addCommentPost = async (req: RequestWithUser, res: Response) => {
    try {
      const userId: string = req.user._id.valueOf()
      const postId: string = req.params.id
      const comment: string = req.body.data
      const isImage: string = req.body.is_image
      const addComment: CommentFormat = await this.postService.addComment(userId, postId, comment, isImage)
      const data = addComment ? formatComment(addComment) : {}
      resSuccess(res, data, 'Add success')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public editCommentPost = async (req: RequestWithUser, res: Response) => {
    try {
      const postId: string = req.params.post_id
      const commentId: string = req.params.comment_id
      const dataUpdate: string = req.body.data
      const editComment: CommentFormat = await this.postService.editComment(postId, commentId, dataUpdate)
      const data = editComment ? formatComment(editComment) : {}
      resSuccess(res, data, 'Update')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public deleteCommentsPost = async (req: RequestWithUser, res: Response) => {
    try {
      const postId: string = req.params.post_id
      const commentId: string = req.params.comment_id
      const deleteCommentData: PostFormat = await this.postService.deleteComment(postId, commentId)
      resSuccess(res, formatPost(deleteCommentData), 'deleted')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public reaction = async (req: RequestWithUser, res: Response) => {
    try {
      const postId: string = req.params.id
      const reacted_by: string = req.user._id.valueOf()
      const post: PostFormat = await this.postService.reaction(postId, reacted_by)
      resSuccess(res, formatPost(post), 'Success')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public unReaction = async (req: RequestWithUser, res: Response) => {
    try {
      const postId: string = req.params.id
      const reacted_by: string = req.user._id.valueOf()
      const postData: PostFormat = await this.postService.unReaction(postId, reacted_by)
      resSuccess(res, formatPost(postData), 'Success')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public search = async (req: RequestWithUser, res: Response) => {
    try {
      const tag: string = req.query.tag as string || ''
      const message: string = req.query.q as string
      const page: string = req.query.page as string || '1'
      const searchPosts: PostFormat[] = await this.postService.search(tag, message, page)
      resSuccess(res, searchPosts.map(post => formatPost(post)), 'Result search')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }
}

export default PostsController
