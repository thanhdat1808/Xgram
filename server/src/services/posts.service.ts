import { HttpException } from '@exceptions/HttpException'
import { CreatePostDto, UpdatePostDto, AddComment, EditComment } from '@/dtos/posts.dto'
import { Comment, CommentFormat, Post, PostFormat, Reaction } from '@interfaces/posts.interface'
import postModel from '@models/posts.model'
import userModel from '@/models/users.model'
import { isEmpty } from '@utils/util'
import { statusCode } from '@/utils/statuscode'
import { User } from '@/interfaces/users.interface'
import { CustomError } from '@/utils/custom-error'
class PostService {
  public posts = postModel
  public users = userModel
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
    path: 'comments.commented_by',
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

  public async findPostById(postId: string): Promise<PostFormat> {
    try {
      if (isEmpty(postId)) throw new HttpException(400, 'postId is empty')
      const findPost: PostFormat = await this.posts.findById(postId).populate(this.populate)
      if (!findPost) throw new HttpException(409, 'Post doesn\'t exist')
      return findPost
    } catch (error) {
      throw new HttpException(500, error.message)
    }
  }

  public async getPostFollow(userId: string): Promise<PostFormat[]> {
    try {
      if (isEmpty(userId)) throw new HttpException(400, 'UserId is empty')
      const findUser: User = await this.users.findById(userId)
      if(!findUser) throw new CustomError('User doesn\'t exist', {}, statusCode.CONFLICT)
      const findPost: PostFormat[] = await this.posts.find({ posted_by: {$in: findUser.following} }).populate(this.populate)
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

  public async addComment(commentData: AddComment): Promise<PostFormat> {
    try {
      const findPost: Post = await this.posts.findById(commentData.id_post)
      if (!findPost) throw new HttpException(409, 'Post doesn\'t exist')
      const newComment: Comment = {
        comment: commentData.comment,
        commented_by: commentData.comment_by
      }
      findPost.comments.push(newComment)
      await this.posts.findByIdAndUpdate(commentData.id_post, { comments: findPost.comments })
      const posts: PostFormat = await this.posts.findById(commentData.id_post).populate(this.populate)
      return posts
    } catch (error) {
      throw new CustomError('Fail to insert DB', {}, statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public async editComment(postId: string, commentId: string, dataUpdate: EditComment): Promise<PostFormat> {
    try {
      const postUpdate: PostFormat = await this.posts.findOneAndUpdate(
        {
          _id: postId,
          comments: {
            $elemMatch: { _id: commentId }
          }
        }, {
        $set: {
          'comments.$.comment': dataUpdate.comment
        }
      }, { new: true, safe: true, upsert: true }).populate(this.populate)
      if (!postUpdate) throw new HttpException(409, 'Post doesn\'t exist')
      return postUpdate
    } catch (error) {
      throw new HttpException(500, error.message)
    }
  }

  public async deleteComment(postId: string, commentId: string): Promise<Post> {
    try {
      const deleteComment: Post = await this.posts.findOneAndUpdate(
        {
          _id: postId
        }, {
        $pull: {
          comments: { _id: commentId }
        }
      }, { new: true })
      return deleteComment
    } catch (error) {
      throw new HttpException(500, error.message)
    }
  }
  public async reaction(postId: string, react_type: number, reacted_by: string): Promise<PostFormat> {
    try {
      const findPost: Post = await this.posts.findById(postId)
      if (!findPost) throw new HttpException(409, 'Post doesn\'t exist')
      const checkUser: number = findPost.reactions.filter(e => e.reacted_by == reacted_by).length
      if (!checkUser) {
        const newReaction: Reaction = {
          type: react_type,
          reacted_by: reacted_by
        }
        findPost.reactions.push(newReaction)
      }
      else throw new HttpException(statusCode.CONFLICT, 'User is exited')
      await this.posts.findByIdAndUpdate(postId, { reactions: findPost.reactions })
      const posts: PostFormat = await this.posts.findById(postId).populate(this.populate)
      return posts
    } catch (error) {
      throw new CustomError('Fail to insert DB', {}, statusCode.INTERNAL_SERVER_ERROR)
    }
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

  public async changeReaction(postId: string, type: number, reacted_by: string): Promise<Post> {
    try {
      const postUpdate: Post = await this.posts.findOneAndUpdate(
        {
          _id: postId,
          reactions: {
            $elemMatch: { reacted_by: reacted_by }
          }
        }, {
        $set: {
          'reactions.$.type': type
        }
      }, { new: true, safe: true, upsert: true })
      if (!postUpdate) throw new HttpException(409, 'Post doesn\'t exist')
      return postUpdate
    } catch (error) {
      throw new HttpException(500, error.message)
    }
  }
}

export default PostService
