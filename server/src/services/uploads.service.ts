import { HttpException } from '@exceptions/HttpException'
import { isEmpty } from '@utils/util'
import { statusCode } from '@/utils/statuscode'
import { CustomError } from '@/utils/custom-error'
import axios from 'axios'
import FormData from 'form-data'
class UploadService {
  public isVideo = ['avi', 'mp4', 'mkv', 'wmv', 'vob', 'flv', 'dlvx']

  private async addTag(url: string) {
    try {
      const data = new FormData()
      data.append('url', `${process.env.URL}${url}`)
      const tag = await axios(process.env.CLASSIFY_API, {
        method: 'POST',
        data: data
      })
      return tag.data.class_name
    } catch (error) {
      console.log(error)
    }
  }

  public async uploads(files: Express.Multer.File[]) {
    try {
      console.log(files)
      if (isEmpty(files)) throw new HttpException(400, 'Medias is empty')
      const medias = []
      for (const element of files) {
        const mimetype: string = element['mimetype']
        const url = `/uploads/${element['filename']}`
        const is_video: boolean = this.isVideo.includes(mimetype.split('/')[1])
        let item = new Object()
        item = {
          url: url,
          is_video: is_video
        }
        if (is_video) {
          item = {
            ...item,
            tag: 'video'
          }
        }
        else {
          item = {
            ...item,
            tag: await this.addTag(url)
          }
        }
        medias.push(item)
      }
      return medias
    }
    catch (error) {
      throw new CustomError('Fail upload medias', {}, statusCode.INTERNAL_SERVER_ERROR)
    }
  }
}
export default UploadService
