import { Response } from 'express'
import { CreateStories } from '@/dtos/stories.dto'
import { Story, StoryFormat } from '@/interfaces/stories.interface'
import userService from '@services/users.service'
import StoriesService from '@/services/stories.service'
import { resError, resSuccess } from '@/utils/custom-response'
import { RequestWithUser } from '@interfaces/auth.interface'
import { formatStories } from '@/utils/formatData'
import { statusCode } from '@/utils/statuscode'

class StoriesController {
  public userService = new userService()
  public storiesService = new StoriesService()
  
    public getStories = async (req: RequestWithUser, res: Response) => {
      try {
        const userId: string = req.user._id.valueOf()
        const getStories: StoryFormat[] = await this.storiesService.getStories(userId)
        resSuccess(res, getStories.map(story => formatStories(story)), 'Get posts')
      } catch (error) {
        resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
      }
    }

  public getStoriesById = async (req: RequestWithUser, res: Response) => {
    try {
      const postId: string = req.params.id
      const getStories: StoryFormat = await this.storiesService.getStoriesById(postId)
      resSuccess(res, formatStories(getStories), 'finOne')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public createStories = async (req: RequestWithUser, res: Response) => {
    try {
      const postData: CreateStories = {
        ...req.body,
        posted_by: req.user._id.valueOf()
      }
      const createStory: StoryFormat = await this.storiesService.createStories(postData)
      resSuccess(res, formatStories(createStory), 'created')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public updateStories = async (req: RequestWithUser, res: Response) => {
    try {
      const postId: string = req.params.id
      const postData: CreateStories = req.body
      const updatePostData: StoryFormat = await this.storiesService.updateStories(postId, postData)
      resSuccess(res, formatStories(updatePostData), 'updated')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public deleteStories = async (req: RequestWithUser, res: Response) => {
    try {
      const storyId: string = req.params.id
      const deletePostData: Story = await this.storiesService.deleteStories(storyId)
      resSuccess(res, deletePostData, 'deleted')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public deleteStoriesMedia = async (req: RequestWithUser, res: Response) => {
    try {
      const storyId: string = req.params.id
      const mediaId: string = req.params.media_id
      const deletePostData: StoryFormat = await this.storiesService.deleteStoriesMedia(storyId, mediaId)
      resSuccess(res, formatStories(deletePostData), 'deleted')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }
}

export default StoriesController
