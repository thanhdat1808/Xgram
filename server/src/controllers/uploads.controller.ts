import { Response } from 'express'
import { resError, resSuccess } from '@/utils/custom-response'
import { RequestWithUser } from '@interfaces/auth.interface'
import UploadService from '@/services/uploads.service'
import { statusCode } from '@/utils/statuscode'

class UploadsController {
  public uploadService = new UploadService()

  public upload = async (req: RequestWithUser, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[]
      console.log(files)
      const resData = await this.uploadService.uploads(files)
      resSuccess(res, resData, 'Upload success')
    } catch (error) {
      resError(res, error.message || error as string, error.code || statusCode.INTERNAL_SERVER_ERROR)
    }
  }
}

export default UploadsController
