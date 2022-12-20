import { compare, hash } from 'bcrypt'
import { PasswordDto, UpdateUserDto } from '@dtos/users.dto'
import { User, UserFormat } from '@interfaces/users.interface'
import userModel from '@models/users.model'
import postModel from '@/models/posts.model'
import { isEmpty } from '@utils/util'
import { CustomError } from '@/utils/custom-error'
import { statusCode } from '@/utils/statuscode'
import { PostFormat } from '@/interfaces/posts.interface'
class UserService {
  public users = userModel
  public posts = postModel
  public populate = ['followers', 'following']
  public perPage = 10
  public populatePost = [{
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

  public async findAllUser(): Promise<User[]> {
    const users: User[] = await this.users.find()
    return users
  }

  public async findUserById(userId: string): Promise<User> {
    if (isEmpty(userId)) throw new CustomError('UserId is empty', {}, statusCode.BAD_REQUEST)
    const findUser: User = await this.users.findOne({user_name: userId}).populate(this.populate) || await this.users.findById(userId).populate(this.populate)
    if (!findUser) throw new CustomError('User doesn`t exist', {}, statusCode.CONFLICT)
    return findUser
  }

  public async getProfilePosts(userId: string, page: string): Promise<PostFormat[]> {
    if (isEmpty(userId)) throw new CustomError('User id is empty', {}, statusCode.BAD_REQUEST)
    const findUser: User = await this.users.findOne({user_name: userId}).populate(this.populate) || await this.users.findById(userId).populate(this.populate)
    if(!findUser) throw new CustomError('User doesn\'t exist', {}, statusCode.CONFLICT)
    const profilePosts: PostFormat[] = await this.posts.find({
      posted_by: findUser._id
    }).limit(this.perPage).skip((+page-1)*this.perPage).sort('created_at').populate(this.populatePost)
    return profilePosts
  }

  public async updatePassword(userId: string, dataPassword: PasswordDto) {
    if (isEmpty(dataPassword)) throw new CustomError('Data is empty', {}, statusCode.BAD_REQUEST)
    const userData: User = await this.users.findById(userId)
    if(!userData) throw new CustomError('User doesn\'t exist', {}, statusCode.BAD_REQUEST)
    const isPasswordMatching: boolean = await compare(dataPassword.old_password, userData.password)
    if (!isPasswordMatching) throw new CustomError('Password is not matching', {}, statusCode.CONFLICT)
    const hashedPassword = await hash(dataPassword.new_password, 10)
    const updateUser: User = await this.users.findOneAndUpdate({ _id: userId }, { password: hashedPassword, updated_at: Date.now() }, { new: true })
    return updateUser
  }

  public async updateUser(userId: string, userData: UpdateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new CustomError('Data is empty', {}, statusCode.BAD_REQUEST)
    if (userData.email) {
      const findUser: User = await this.users.findOne({ email: userData.email })
      if (findUser && findUser._id != userId) throw new CustomError(`This email ${userData.email} already exists`, {}, statusCode.CONFLICT)
    }
    const updateUserById: User = await this.users.findOneAndUpdate({ _id: userId }, { ...userData, updated_at: Date.now() }, { new: true}).populate(this.populate)
    if (!updateUserById) throw new CustomError('User doesn\'t exist', {}, statusCode.CONFLICT)
    return updateUserById
  }

  public async deleteUser(userId: string): Promise<User> {
    const deleteUserById: User = await this.users.findByIdAndDelete(userId)
    if (!deleteUserById) throw new CustomError('User doesn\'t exist', {}, statusCode.CONFLICT)

    return deleteUserById
  }

  public async followUser(userId: string, followId: string): Promise<User> {
    try {
      if(userId===followId) throw new CustomError('Id is confict', {}, statusCode.CONFLICT)
      const findUser = await this.users.findOne({ _id: userId })
      if (!findUser) throw new CustomError('User doesn\'t exist', {}, statusCode.UNPROCESSABLE_ENTITY)
      const followUser = await this.users.findOne({ _id: followId })
      if (!followUser) throw new CustomError('User follow doesn\'t exist', {}, statusCode.UNPROCESSABLE_ENTITY)
      if (findUser.following.indexOf(followId as never) !== -1) throw new CustomError('Already follow this user', {}, statusCode.UNPROCESSABLE_ENTITY)
      const addFollow: User = await this.users.findOneAndUpdate(
        {
          _id: userId
        },
        {
          $push: { following: followId }
        }, {
          new: true
        }
      ).populate(this.populate)
      await this.users.findOneAndUpdate(
        {
          _id: followId
        },
        {
          $push: { followers: userId }
        }, {
          new: true
        }
      )
      return addFollow
    } catch (error) {
      if(error.code) throw error
      throw new CustomError('Fail to search DB', {}, statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public async unFollowUser(userId: string, followId: string): Promise<User> {
    try {
      const findUser = await this.users.findOne({ _id: userId })
      if (!findUser) throw new CustomError('User doesn\'t exist', {}, statusCode.UNPROCESSABLE_ENTITY)
      const followUser = await this.users.findOne({ _id: followId })
      if (!followUser) throw new CustomError('User follow doesn\'t exist', {}, statusCode.UNPROCESSABLE_ENTITY)
      if (findUser.following.indexOf(followId as never) === -1) throw new CustomError('Not follow this user', {}, statusCode.UNPROCESSABLE_ENTITY)
      const unFollow: User = await this.users.findOneAndUpdate(
        {
          _id: userId
        },
        {
          $pull: { following: followId }
        }
      ).populate(this.populate)
      await this.users.findOneAndUpdate(
        {
          _id: followId
        },
        {
          $pull: { followers: userId }
        }, {
          new: true
        }
      )
      return unFollow
    } catch (error) {
      if(error.code) throw error
      throw new CustomError('Fail to search DB', {}, statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public async removeFollowUser(userId: string, followId: string): Promise<User> {
    try {
      const findUser = await this.users.findOne({ _id: userId })
      if (!findUser) throw new CustomError('User doesn\'t exist', {}, statusCode.UNPROCESSABLE_ENTITY)
      const followUser = await this.users.findOne({ _id: followId })
      if (!followUser) throw new CustomError('User follow doesn\'t exist', {}, statusCode.UNPROCESSABLE_ENTITY)
      if (findUser.following.indexOf(followId as never) === -1) throw new CustomError('Not follow this user', {}, statusCode.UNPROCESSABLE_ENTITY)
      const unFollow: User = await this.users.findOneAndUpdate(
        {
          _id: userId
        },
        {
          $pull: { followers: followId }
        }
      ).populate(this.populate)
      await this.users.findOneAndUpdate(
        {
          _id: followId
        },
        {
          $pull: { following: userId }
        }, {
          new: true
        }
      )
      return unFollow
    } catch (error) {
      if(error.code) throw error
      throw new CustomError('Fail to search DB', {}, statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public async getBlockUser(userId: string): Promise<User[]> {
    const blockUsers: UserFormat = await this.users.findById(userId).populate('blocked_users')
    return blockUsers.blocked_users
  }

  public async blockUser(userId: string, blockUserId: string): Promise<User> {
    if(isEmpty(blockUserId)) throw new CustomError('User id is empty', {}, statusCode.BAD_REQUEST)
    const blockUser: User = await this.users.findOneAndUpdate({
      _id: userId
    }, {
      $push: {
        blocked_users: blockUserId
      }
    }, {
      new: true
    })
    return blockUser
  }

  public async unBlockUser(userId: string, blockUserId: string): Promise<User> {
    if(isEmpty(blockUserId)) throw new CustomError('User id is empty', {}, statusCode.BAD_REQUEST)
    const blockUser: User = await this.users.findOneAndUpdate({
      _id: userId
    }, {
      $pull: {
        blocked_users: blockUserId
      }
    }, {
      new: true
    }) 
    return blockUser
  }

  public async searchUsers(userId: string, name: string, page: string): Promise<User[]> {
    const searchUsers: User[] = await this.users.find({
      $or: [
        {full_name: new RegExp(name, 'i')},
        {user_name: new RegExp(name, 'i')}
      ],
      _id: {$ne: userId}
    }).limit(this.perPage).skip((+page-1)*this.perPage).sort('created_at').populate(this.populate)
    if(!searchUsers.length) throw new CustomError('No matching results', {}, statusCode.BAD_REQUEST)
    return searchUsers
  }
}

export default UserService
