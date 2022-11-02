import { HttpException } from '@exceptions/HttpException';
import { CreatePostDto } from '@/dtos/posts.dto';
import { Post } from '@interfaces/posts.interface';
import postModel from '@models/posts.model';
import { isEmpty } from '@utils/util';
import { v4 as uuidv4 } from 'uuid'
class PostService {
  public posts = postModel;
  public isVideo = ['avi', 'mp4', 'mkv', 'wmv', 'vob', 'flv', 'dlvx']
  // public async findAllUser(): Promise<User[]> {
  //   const users: User[] = await this.users.find();
  //   return users;
  // }

  public async findPostById(postId: string): Promise<Post> {
    try {
      if (isEmpty(postId)) throw new HttpException(400, 'postId is empty');
      const findPost: Post = await this.posts.findOne({ _id: postId });
      if (!findPost) throw new HttpException(409, "Post doesn't exist");
      return findPost;
    } catch (error) {
      throw new HttpException(500, error.message);
    }
  }

  public async createPost(postData: CreatePostDto) {
    try {
      if (isEmpty(postData)) throw new HttpException(400, 'postData is empty');
      const medias = []
      postData.medias.forEach(element => {
        const mimetype: string = element['mimetype']
        const item = {
          media_id: uuidv4(),
          url: `${process.env.URL}/uploads/${element['filename']}`,
          is_video: this.isVideo.includes(mimetype.split('/')[1])
        }
        medias.push(item)
      });
      const createPost: Post = await this.posts.create({ ...postData, medias: medias });
      return createPost;
    }
    catch (error) {
      throw new HttpException(500, `Fail to insert DB`);
    }
  }

  public async updatePost(postId: string, postData: CreatePostDto, newMedias: Express.Multer.File[]): Promise<Post> {
    if (isEmpty(postData)) throw new HttpException(400, 'postData is empty');
    const medias = Object.assign([], postData.medias)
    if (newMedias) {
      newMedias.forEach(element => {
        const mimetype: string = element['mimetype']
        const item = {
          media_id: uuidv4(),
          url: `${process.env.URL}/uploads/${element['filename']}`,
          is_video: this.isVideo.includes(mimetype.split('/')[1])
        }
        medias.push(item)
      });
    }
    postData.medias = medias
    console.log('dddddddd', postData);

    const updatePostById: Post = await this.posts.findByIdAndUpdate(postId, { postData });
    if (!updatePostById) throw new HttpException(409, "Post doesn't exist");
    console.log('11111', updatePostById);
    return updatePostById;
  }

  public async deletePost(postId: string): Promise<Post> {
    try {
      const deletePostById: Post = await this.posts.findByIdAndDelete(postId);
      if (!deletePostById) throw new HttpException(409, "Post doesn't exist");
      return deletePostById;
    } catch (error) {
      throw new HttpException(500, error.message)
    }
  }
}

export default PostService;
