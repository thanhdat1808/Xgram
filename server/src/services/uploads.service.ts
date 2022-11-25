import { HttpException } from '@exceptions/HttpException'
import { isEmpty } from '@utils/util'
import { v4 as uuidv4 } from 'uuid'
import { statusCode } from '@/utils/statuscode'
import { CustomError } from '@/utils/custom-error'
class UploadService {
  public isVideo = ['avi', 'mp4', 'mkv', 'wmv', 'vob', 'flv', 'dlvx']

  public async uploads(files: Express.Multer.File[]) {
    try {
      if (isEmpty(files)) throw new HttpException(400, 'Medias is empty')
      const medias = []
      files.forEach(element => {
        const mimetype: string = element['mimetype']
        const item = {
          media_id: uuidv4(),
          url: `${process.env.URL}/uploads/${element['filename']}`,
          is_video: this.isVideo.includes(mimetype.split('/')[1])
        }
        medias.push(item)
      })
      return medias
    }
    catch (error) {
      throw new CustomError('Fail upload medias', {}, statusCode.INTERNAL_SERVER_ERROR)
    }
  }
}
export default UploadService
