import { HttpException } from '@exceptions/HttpException'
import { CreatePostDto, UpdatePostDto, TMedia, AddComment, EditComment } from '@/dtos/posts.dto'
import { Comment, Post } from '@interfaces/posts.interface'
import postModel from '@models/posts.model'
import { isEmpty } from '@utils/util'
import { v4 as uuidv4 } from 'uuid'
class PostService {
  public posts = postModel
  public isVideo = ['avi', 'mp4', 'mkv', 'wmv', 'vob', 'flv', 'dlvx']

  public async findPostById(postId: string): Promise<Post> {
    try {
      if (isEmpty(postId)) throw new HttpException(400, 'postId is empty')
      const findPost: Post = await this.posts.findOne({ _id: postId })
      if (!findPost) throw new HttpException(409, 'Post doesn\'t exist')
      return findPost
    } catch (error) {
      throw new HttpException(500, error.message)
    }
  }

  public async createPost(postData: CreatePostDto) {
    try {
      if (isEmpty(postData)) throw new HttpException(400, 'postData is empty')
      const medias = []
      postData.medias.forEach(element => {
        const mimetype: string = element['mimetype']
        const item = {
          media_id: uuidv4(),
          url: `${process.env.URL}/uploads/${element['filename']}`,
          is_video: this.isVideo.includes(mimetype.split('/')[1])
        }
        medias.push(item)
      })
      const createPost: Post = await this.posts.create({ ...postData, medias: medias })
      return createPost
    }
    catch (error) {
      throw new HttpException(500, 'Fail to insert DB')
    }
  }

  public async updatePost(postId: string, postData: UpdatePostDto, newMedias: Express.Multer.File[]): Promise<Post> {
    if (isEmpty(postData)) throw new HttpException(400, 'postData is empty')
    const medias: TMedia[] = []
    if (newMedias) {
      newMedias.forEach(element => {
        const mimetype: string = element['mimetype']
        const item = {
          media_id: uuidv4(),
          url: `${process.env.URL}/uploads/${element['filename']}`,
          is_video: this.isVideo.includes(mimetype.split('/')[1])
        }
        medias.push(item)
      })
    }
    postData.medias = [...medias]
    const updatePostById: Post = await this.posts.findByIdAndUpdate(postId, { message: postData.message, medias: postData.medias })
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

  public async getComment(postId: string): Promise<Comment[]> {
    try {
      const findPost: Post = await this.posts.findOne({ _id: postId })
      if (!findPost) throw new HttpException(409, 'Post doesn\'t exist')
      return findPost.comments
    } catch (error) {
      throw new HttpException(500, error.message)
    }
  }

  public async addComment(commentData: AddComment): Promise<Post> {
    try {
      const findPost: Post = await this.posts.findById(commentData.id_post)
      if (!findPost) throw new HttpException(409, 'Post doesn\'t exist')
      const newComment: Comment = {
        comment: commentData.comment,
        commented_by: commentData.comment_by
      }
      findPost.comments.push(newComment)
      await this.posts.findByIdAndUpdate(commentData.id_post, { comments: findPost.comments })
      const posts: Post = await this.posts.findById(commentData.id_post)
      return posts
    } catch (error) {
      throw new HttpException(500, error.message)
    }
  }

  public async editComment(postId: string, dataUpdate: EditComment): Promise<Post> {
    try {
      const postUpdate: Post = await this.posts.findOneAndUpdate(
        {
          _id: postId,
          comments: {
            $elemMatch: { _id: dataUpdate.id_comment }
          }
        }, {
        $set: {
          'comments.$.comment': dataUpdate.comment
        }
      }, { new: true, safe: true, upsert: true })
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
}

export default PostService
