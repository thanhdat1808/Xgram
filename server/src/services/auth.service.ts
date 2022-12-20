import { hash, compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { SECRET_KEY } from '@config'
import { CreateUserDto } from '@dtos/users.dto'
import { HttpException } from '@exceptions/HttpException'
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface'
import { User } from '@interfaces/users.interface'
import userModel from '@models/users.model'
import { isEmpty } from '@utils/util'
import { CustomError } from '@/utils/custom-error'
import { statusCode } from '@/utils/statuscode'
import { sendMail } from '@/utils/sendMail'
import tokenModel from '@/models/token.model'
import resetPasswordModel from '@/models/resetpassword.model'

class AuthService {
  public users = userModel
  public tokens = tokenModel
  public resetpasswords = resetPasswordModel
  public populate = ['followers', 'following']
  public async signup(userData: CreateUserDto): Promise<{cookie: string, createUserData: User}> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty')

    const findUser: User = await this.users.findOne(
      { 
        $or: [
          {email: userData.email},
          {user_name: userData.user_name}
        ]
      }
      )
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`)

    const hashedPassword = await hash(userData.password, 10)
    const createUserData: User = await (await this.users.create({ ...userData, password: hashedPassword })).populate(this.populate)
    const tokenData = this.createToken(createUserData)
    const cookie = this.createCookie(tokenData)

    return {cookie, createUserData}
  }

  public async login(userData: CreateUserDto): Promise<{ cookie: string; findUser: User }> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty')

    const findUser: User = await this.users.findOne({ email: userData.email }).populate(this.populate)
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`)

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password)
    if (!isPasswordMatching) throw new HttpException(409, 'Password is not matching')

    const tokenData = this.createToken(findUser)
    const cookie = this.createCookie(tokenData)

    return { cookie, findUser }
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty')

    const findUser: User = await this.users.findOne({ email: userData.email, password: userData.password })
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`)

    return findUser
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id }
    const secretKey: string = SECRET_KEY
    const expiresIn: number = 600 * 60

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) }
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`
  }

  public async forgotPassword(email: string): Promise<void> {
    const findUser: User = await this.users.findOne({ email: email })
    if(!findUser) throw new CustomError(`This email ${email} was not found`, {}, statusCode.BAD_REQUEST)
    const tokenData = this.createToken({_id: 'id'} as User)  
    await this.tokens.create({ user_id: findUser._id, token: tokenData.token })
    const link = `${process.env.URL}/reset-password/${findUser._id}/${tokenData.token}`
    const contentMail = `Click on the link below to create a new password \n ${link}`
    await sendMail(email, 'X-Gram forgot password', contentMail)
    return
  }

  public async resetPassword(userId: string, token: string): Promise<void> {
    const findUser = await this.users.findById(userId)
    if(!findUser) throw new CustomError('Invalid link or expired', {}, statusCode.BAD_REQUEST)
    const findToken = await this.tokens.findOne({ user_id: userId, token: token })
    if(!findToken) throw new CustomError('Invalid link or expired', {}, statusCode.BAD_REQUEST)
    const password = Math.random().toString(36).slice(-8)
    const hashedPassword = await hash(password, 10)
    await this.resetpasswords.create({user_id: userId, password: hashedPassword})
    await sendMail(findUser.email, 'X-Gram reset password', password)
    await findToken.delete()
    return
  }

  public async loginResetPassword(email: string, password: string): Promise<{ cookie: string; findUser: User }> {
    const findUser: User = await this.resetpasswords.findOne({ email: email }).populate(this.populate)
    if (!findUser) throw new HttpException(409, `This email ${email} was not found`)

    const isPasswordMatching: boolean = await compare(password, findUser.password)
    if (!isPasswordMatching) throw new CustomError('Password is not matching', {}, statusCode.CONFLICT)

    const tokenData = this.createToken(findUser)
    const cookie = this.createCookie(tokenData)

    return { cookie, findUser }
  }
}

export default AuthService
