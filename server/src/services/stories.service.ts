import { HttpException } from '@exceptions/HttpException'
import { Story, StoryFormat } from '@/interfaces/stories.interface'
import userModel from '@/models/users.model'
import storiesModel from '@/models/stories.model'
import { isEmpty } from '@utils/util'
import { statusCode } from '@/utils/statuscode'
import { User } from '@/interfaces/users.interface'
import { CustomError } from '@/utils/custom-error'
import { CreateStories } from '@/dtos/stories.dto'

class StoriesService {
  public stories = storiesModel
  public users = userModel
  public populate = {
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
  }

  public async getStoriesById(storyId: string): Promise<StoryFormat> {
    try {
      if (isEmpty(storyId)) throw new HttpException(400, 'storyId is empty')
      const findStories: StoryFormat = await this.stories.findById(storyId).populate(this.populate)
      if (!findStories) throw new HttpException(409, 'Stories doesn\'t exist')
      return findStories
    } catch (error) {
      throw new CustomError(error, {}, statusCode.NOT_IMPLEMENTED)
    }
  }

  public async getStories(userId: string): Promise<StoryFormat[]> {
    try {
      if (isEmpty(userId)) throw new HttpException(400, 'UserId is empty')
      const findUser: User = await this.users.findOne({_id: userId})
      if(!findUser) throw new HttpException(statusCode.CONFLICT, 'User doesn\'t exist')
      const findStories: StoryFormat[] = await this.stories.find({
        $or: [
          { posted_by: {$in: findUser.following}, created_at: {$gt:new Date(Date.now() - 24*60*60 * 1000)} },
          { posted_by: userId, created_at: {$gt:new Date(Date.now() - 24*60*60 * 1000)} }
        ]
      }).populate(this.populate)
      if (!findStories) throw new HttpException(409, 'Post doesn\'t exist')
      const stories = []
      for(const story of findStories){
        const existStory = stories.find(x=>x.posted_by._id===story.posted_by._id)
        if(!existStory){
          stories.push({
            _id:story._id,
            medias:story.medias.map(m=>({
              story_id:story._id,
              _id: m._id,
              url:m.url,
              is_video:m.is_video,
              created_at:story.created_at
          })),
          posted_by:story.posted_by
          })
        }else{
          existStory.medias = [
            ...existStory.medias,
            ...story.medias.map(m=>({
              story_id: story._id,
              _id: m._id,
              url:m.url,
              is_video:m.is_video,
              created_at:story.created_at
            }))
          ]
        }
      }
      return stories
    } catch (error) {
      throw new CustomError(error, {}, statusCode.NOT_IMPLEMENTED)
    }
  }

  public async createStories(storiesData: CreateStories) {
    try {
      if (isEmpty(storiesData)) throw new HttpException(400, 'Data is empty')
      const createStories: StoryFormat = await (await this.stories.create({ ...storiesData })).populate(this.populate)
      return createStories
    }
    catch (error) {
      throw new CustomError('Fail to insert DB', {}, statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public async updateStories(postId: string, postData: CreateStories): Promise<StoryFormat> {
    if (isEmpty(postData)) throw new HttpException(400, 'Data is empty')
    const updatePostById: StoryFormat = await this.stories.findByIdAndUpdate(postId, { ...postData, updated_at: Date.now()})
    if (!updatePostById) throw new HttpException(409, 'Stories doesn\'t exist')
    return updatePostById
  }

  public async deleteStories(storyId: string): Promise<Story> {
    try {
      const deletePostById: Story = await this.stories.findByIdAndDelete(storyId)
      if (!deletePostById) throw new HttpException(409, 'Stories doesn\'t exist')
      return deletePostById
    } catch (error) {
      throw new HttpException(500, error.message)
    }
  }

  public async deleteStoriesMedia(storyId: string, mediaId: string): Promise<StoryFormat> {
    try {
      const deleteMediaById: StoryFormat = await this.stories.findOneAndUpdate(
        {
          _id: storyId
        }, {
        $pull: {
          medias: { media_id: mediaId }
        }
      }, { new: true }
      //update media 
      ).populate(this.populate)
      if (!deleteMediaById) throw new HttpException(409, 'Stories doesn\'t exist')
      return deleteMediaById
    } catch (error) {
      throw new HttpException(500, error.message)
    }
  }
}

export default StoriesService
