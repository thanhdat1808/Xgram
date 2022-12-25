import { HttpException } from '@exceptions/HttpException'
import { CreatePostDto, UpdatePostDto } from '@/dtos/posts.dto'
import { CommentFormat, Post, PostFormat } from '@interfaces/posts.interface'
import postModel from '@models/posts.model'
import userModel from '@/models/users.model'
import commentModel from '@/models/comments.model'
import { isEmpty } from '@utils/util'
import { NotificationType, statusCode } from '@/utils/statuscode'
import { User } from '@/interfaces/users.interface'
import { CustomError } from '@/utils/custom-error'
import NotificationsService from './notifications.service'
import { CreateNotification } from '@/interfaces/notifications.interface'
import { sendNotification } from '@/socket/events'
import { app } from '@/socket/index.socket'
import { io } from '@/server'

class PostService {
  public posts = postModel
  public users = userModel
  public comments = commentModel
  public notificationService = new NotificationsService()
  public perPage = 10
  public regex = /(?<=@)\w+/g
  public populate = [{
    path: 'posted_by',
    populate: [
      {
        path: 'followers',
        model: 'User'
      },
      {
        path: 'following',
        model: 'User'
      }
    ]
  }, {
    path: 'comments',
    populate: {
      path: 'commented_by',
      populate: [
        {
          path: 'followers',
          model: 'User'
        },
        {
          path: 'following',
          model: 'User'
        }
      ]
    },
    options: {
      sort: { 'created_at': -1 }
    }
  }, {
    path: 'reactions.reacted_by',
    populate: [
      {
        path: 'followers',
        model: 'User'
      },
      {
        path: 'following',
        model: 'User'
      }
    ]
  }]
  public populateComment = 'commented_by'

  public async getPostDetail(userId: string, postId: string): Promise<PostFormat> {
    try {
      if (isEmpty(postId)) throw new HttpException(400, 'postId is empty')
      const findPost: PostFormat = await this.posts.findById(postId).populate(this.populate)
      if (!findPost) throw new HttpException(409, 'Post doesn\'t exist')
      if(findPost.privacy === 'private' && findPost.posted_by._id !== userId ) return
      return findPost
    } catch (error) {
      throw new HttpException(500, error.message)
    }
  }

  public async getHomePost(userId: string, page: string): Promise<PostFormat[]> {
    try {
      if (isEmpty(userId)) throw new HttpException(400, 'UserId is empty')
      const findUser: User = await this.users.findById(userId)
      if(!findUser) throw new CustomError('User doesn\'t exist', {}, statusCode.CONFLICT)
      const findPost: PostFormat[] = await this.posts.find({
        $or: [
          {
            $and: [
              {
                $or: [
                  { posted_by: {$in: findUser.following} },
                  { privacy: 'public'}
                ]
              },
              {
                privacy: { $ne: 'private' }
              }
            ]
          },
          { posted_by: userId }
        ]
      }).limit(this.perPage).skip((+page-1)*this.perPage).sort({'created_at': -1}).populate(this.populate)
      if (!findPost) throw new HttpException(409, 'Post doesn\'t exist')
      return findPost
    } catch (error) {
      throw new HttpException(500, error.message)
    }
  }

  public async createPost(postData: CreatePostDto) {
    try {
      if (isEmpty(postData)) throw new HttpException(400, 'postData is empty')
      const createPost: PostFormat = await (await this.posts.create({ ...postData })).populate(this.populate)
      const mention = postData.message.match(this.regex)
      if(mention) {
        const findUser: User[] = await this.users.find({ username: { $in: mention } }).populate(['followers', 'following'])
        if(findUser) {
          findUser.map(user => async () => {
            const notificationData: CreateNotification = {
              type: NotificationType.MENTION_POST,
              ref_post: createPost._id,
              ref_user: null,
              ref_comment: null,
              user: createPost.posted_by._id,
              to_user: user._id,
              post_id: createPost._id
            }
            const createNotification = await this.notificationService.createNotification(notificationData)
            if(createNotification) {
              sendNotification(app, user._id.valueOf(), createNotification, io)
            }
          })
        }
      }
      return createPost
    }
    catch (error) {
      console.log(error)
      throw new CustomError('Fail to insert DB', {}, statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public async updatePost(postId: string, postData: UpdatePostDto): Promise<PostFormat> {
    if (isEmpty(postData)) throw new HttpException(400, 'postData is empty')
    const updatePostById: PostFormat = await this.posts.findByIdAndUpdate(postId, { ...postData, updated_at: Date.now() }, {new: true}).populate(this.populate)
    if (!updatePostById) throw new HttpException(409, 'Post doesn\'t exist')
    return updatePostById
  }

  public async deletePost(postId: string): Promise<Post> {
    try {
      const deletePostById: Post = await this.posts.findByIdAndDelete(postId)
      if (!deletePostById) throw new HttpException(409, 'Post doesn\'t exist')
      return deletePostById
    } catch (error) {
      throw new HttpException(500, error.message)
    }
  }

  public async getComment(postId: string): Promise<CommentFormat[]> {
    try {
      const findPost: PostFormat = await this.posts.findOne({ _id: postId })
      if (!findPost) throw new HttpException(409, 'Post doesn\'t exist')
      const getComment: CommentFormat[] = await this.comments.find({_id: {$in: findPost.comments} }).sort({'created_at': -1}).populate(this.populateComment)
      return getComment
    } catch (error) {
      throw new HttpException(500, error.message)
    }
  }

  public async addComment(userId: string, postId: string, comment: string, isImage: string): Promise<CommentFormat> {
    try {
      const findPost: Post = await this.posts.findById(postId)
      if (!findPost) throw new HttpException(409, 'Post doesn\'t exist')
      const newComment: CommentFormat = await this.comments.create({
        comment: comment,
        is_image: isImage,
        commented_by: userId
      })
      await this.posts.findByIdAndUpdate(postId, {
        $push: {
          comments: newComment._id
        }
      }, { new: true }).populate(this.populate)
      const getComment: CommentFormat = await this.comments.findById(newComment._id).populate(this.populateComment)
      if(getComment) {
        const createNotif = await this.notificationService.createNotification({
          user: userId,
          to_user: findPost.posted_by,
          type: NotificationType.COMMENT,
          post_id: findPost._id,
          ref_post: null,
          ref_comment: getComment._id,
          ref_user: null
        })
        if(createNotif) {
          sendNotification(app, findPost.posted_by.valueOf(), createNotif, io)
        }
        const mentions = comment.match(this.regex)
        if(mentions.length) {
          const users = await this.users.find({ username: { $in: mentions } })
          if(users) {
            users.forEach(async (user: User) => {
              if(user._id !== userId) {
                const createNotification = await this.notificationService.createNotification({
                  user: user._id,
                  to_user: userId,
                  type: NotificationType.MENTION_COMMENT,
                  post_id: findPost._id,
                  ref_post: null,
                  ref_comment: getComment._id,
                  ref_user: null
                })
                if(createNotification) {
                  sendNotification(app, user._id.valueOf(), createNotification, io)
                }
              }
            })
          }
        }
      }
      return getComment
    } catch (error) {
      throw new CustomError('Fail to insert DB', {}, statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public async editComment(postId: string, commentId: string, dataUpdate: string): Promise<CommentFormat> {
    try {
      const editComment: CommentFormat = await this.comments.findByIdAndUpdate(commentId, {comment: dataUpdate}).populate(this.populateComment)
      const postUpdate: PostFormat = await this.posts.findById(postId).populate(this.populate)
      if (!postUpdate) throw new HttpException(409, 'Post doesn\'t exist')
      return editComment
    } catch (error) {
      throw new HttpException(500, error.message)
    }
  }

  public async deleteComment(postId: string, commentId: string): Promise<PostFormat> {
    const Comment = await this.comments.findByIdAndDelete(commentId)
    if(!Comment) throw new CustomError('Comment is not exist', {}, statusCode.BAD_REQUEST)
    const deleteComment: PostFormat = await this.posts.findOneAndUpdate(
      {
        _id: postId
      }, {
      $pull: {
        comments: commentId
      }
    }, { new: true }).populate(this.populate)
    return deleteComment
  }
  public async reaction(postId: string, reacted_by: string): Promise<PostFormat> {
    const findPost: Post = await this.posts.findById(postId)
    if (!findPost) throw new HttpException(409, 'Post doesn\'t exist')
    const checkUser: number = findPost.reactions.filter(e => e.reacted_by == reacted_by).length
    if (checkUser) throw new HttpException(statusCode.CONFLICT, 'User is exited')
    const post: PostFormat = await this.posts.findByIdAndUpdate(postId, {
      $push: {
        reactions: { reacted_by: reacted_by }
      }
    }, {
      new: true
    }).populate(this.populate)
    if(post && post.posted_by._id.valueOf() !== reacted_by) {
      const data: CreateNotification = {
        user: reacted_by,
        to_user: post.posted_by._id,
        type: NotificationType.REACT,
        post_id: post._id,
        ref_post: post._id,
        ref_comment: null,
        ref_user: null
      }
      const createNotif = await this.notificationService.createNotification(data)
      if(createNotif) {
        sendNotification(app, post._id.valueOf(), createNotif, io)
      }
    }
    return post
  }

  public async unReaction(postId: string, reacted_by: string): Promise<PostFormat> {
    try {
      const post: PostFormat = await this.posts.findOneAndUpdate(
        {
          _id: postId
        }, {
        $pull: {
          reactions: { reacted_by: reacted_by }
        }
      }, { new: true }).populate(this.populate)
      return post
    } catch (error) {
      throw new HttpException(500, error.message)
    }
  }
  public async search(tag: string, message: string, page: string): Promise<PostFormat[]> {
    const searchPost: PostFormat[] = await this.posts.find({
      message: new RegExp(message, 'i'),
      tags: new RegExp(tag, 'i')
    }).limit(this.perPage).skip((+page-1)*this.perPage).sort('created_at').populate(this.populate)
    if(!searchPost) throw new CustomError('No matching results', {}, statusCode.BAD_REQUEST)
    return searchPost
  }
}

export default PostService
