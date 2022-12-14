import { HttpException } from '@exceptions/HttpException'
import { CreatePostDto, UpdatePostDto } from '@/dtos/posts.dto'
import { CommentFormat, Post, PostFormat } from '@interfaces/posts.interface'
import postModel from '@models/posts.model'
import userModel from '@/models/users.model'
import commentModel from '@/models/comments.model'
import { isEmpty } from '@utils/util'
import { statusCode } from '@/utils/statuscode'
import { User } from '@/interfaces/users.interface'
import { CustomError } from '@/utils/custom-error'
class PostService {
  public posts = postModel
  public users = userModel
  public comments = commentModel
  public perPage = 10
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

  public async getPostDetail(postId: string): Promise<PostFormat> {
    try {
      if (isEmpty(postId)) throw new HttpException(400, 'postId is empty')
      const findPost: PostFormat = await this.posts.findById(postId).populate(this.populate)
      if (!findPost) throw new HttpException(409, 'Post doesn\'t exist')
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
        posted_by: {$in: findUser.following}
      }).limit(this.perPage).skip((+page-1)*this.perPage).sort('created_at').populate(this.populate)
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
      return createPost
    }
    catch (error) {
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
      const findPost: PostFormat = await this.posts.findOne({ _id: postId }).populate(this.populate)
      if (!findPost) throw new HttpException(409, 'Post doesn\'t exist')
      return findPost.comments
    } catch (error) {
      throw new HttpException(500, error.message)
    }
  }

  public async addComment(userId: string, postId: string, comment: string): Promise<PostFormat> {
    try {
      const findPost: Post = await this.posts.findById(postId)
      if (!findPost) throw new HttpException(409, 'Post doesn\'t exist')
      const newComment: CommentFormat = await this.comments.create({
        comment: comment,
        commented_by: userId
      })
      const posts: PostFormat = await this.posts.findByIdAndUpdate(postId, {
        $push: {
          comments: newComment._id
        }
      }, { new: true }).populate(this.populate)
      return posts
    } catch (error) {
      throw new CustomError('Fail to insert DB', {}, statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public async editComment(postId: string, commentId: string, dataUpdate: string): Promise<PostFormat> {
    try {
      await this.comments.findByIdAndUpdate(commentId, {comment: dataUpdate})
      const postUpdate: PostFormat = await this.posts.findById(postId).populate(this.populate)
      if (!postUpdate) throw new HttpException(409, 'Post doesn\'t exist')
      return postUpdate
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
    const posts: PostFormat = await this.posts.findByIdAndUpdate(postId, {
      $push: {
        reactions: { reacted_by: reacted_by }
      }
    }, {
      new: true
    }).populate(this.populate)
    return posts
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
      $or: [{
        tags: `/${tag}/`
      }, {
        message: `/${message}/`
      }]
    }).limit(this.perPage).skip((+page-1)*this.perPage).sort('created_at').populate(this.populate)
    if(!searchPost) throw new CustomError('No matching results', {}, statusCode.BAD_REQUEST)
    return searchPost
  }
}

export default PostService
