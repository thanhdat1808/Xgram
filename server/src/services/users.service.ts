import { hash } from 'bcrypt'
import { CreateUserDto, LoginUser } from '@dtos/users.dto'
import { User } from '@interfaces/users.interface'
import userModel from '@models/users.model'
import { isEmpty } from '@utils/util'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { CustomError } from '@/utils/custom-error'
import { statusCode } from '@/utils/statuscode'
class UserService {
  public users = userModel

  public async findAllUser(): Promise<User[]> {
    const users: User[] = await this.users.find()
    return users
  }

  public async findUserById(userId: string): Promise<User> {
    if (isEmpty(userId)) throw new CustomError('UserId is empty', {}, statusCode.BAD_REQUEST)
    const findUser: User = await this.users.findOne({ _id: userId })
    if (!findUser) throw new CustomError('User doesn`t exist', {}, statusCode.CONFLICT)
    return findUser
  }

  public async createUser(userData: CreateUserDto, avatar: Express.Multer.File): Promise<User> {
    try {
      if (isEmpty(userData)) throw new CustomError('UserId is empty', {}, statusCode.BAD_REQUEST)
      const findUser: User = await this.users.findOne({ email: userData.email })
      if (findUser) throw new CustomError(`This email ${userData.email} already exists`, {}, statusCode.CONFLICT)
      const hashedPassword = await hash(userData.password, 10)
      const avatar_url = `${process.env.URL}/avatars/${avatar['filename']}`
      const createUserData: User = await this.users.create({ ...userData, password: hashedPassword, avatar_url: avatar_url })
      return createUserData
    } catch (error) {
      throw new CustomError('Fail to insert DB', {}, statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public async updateUser(userId: string, userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new CustomError('UserId is empty', {}, statusCode.BAD_REQUEST)

    if (userData.email) {
      const findUser: User = await this.users.findOne({ email: userData.email })
      if (findUser && findUser._id != userId) throw new CustomError(`This email ${userData.email} already exists`, {}, statusCode.CONFLICT)
    }

    if (userData.password) {
      const hashedPassword = await hash(userData.password, 10)
      userData = { ...userData, password: hashedPassword }
    }

    const updateUserById: User = await this.users.findByIdAndUpdate(userId, { userData })
    if (!updateUserById) throw new CustomError('User doesn\'t exist', {}, statusCode.CONFLICT)

    return updateUserById
  }

  public async deleteUser(userId: string): Promise<User> {
    const deleteUserById: User = await this.users.findByIdAndDelete(userId)
    if (!deleteUserById) throw new CustomError('User doesn\'t exist', {}, statusCode.CONFLICT)

    return deleteUserById
  }

  public async loginUser(userData: LoginUser): Promise<string> {
    try {
      const user = await this.users.findOne({ email: userData.email })
      if (!user) throw new CustomError('User doesn\'t exist', {}, statusCode.UNPROCESSABLE_ENTITY)

      const checkPassword = await bcrypt.compare(userData.password, user.password)

      if (!checkPassword) throw new CustomError('Email or Password is not correct', {}, statusCode.UNPROCESSABLE_ENTITY)

      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '100h' })
      return token
    } catch (error) {
      throw new CustomError('Fail to search DB', {}, statusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public async followUser(userId: string, followId: string): Promise<User> {
    try {
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
        }
      )
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
      )
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
}

export default UserService
