import { Router } from 'express'
import { Routes } from '@interfaces/routes.interface'
import authMiddleware from '@middlewares/auth.middleware'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import UploadsController from '@/controllers/uploads.controller'

class UploadsRoute implements Routes {
  public path = '/uploads'
  public router = Router()
  public uploadsController = new UploadsController()
  public str = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
      const extension = file.mimetype.split('/')[1]
      cb(null, uuidv4() + '.' + extension)
    }
  })
  public upload = multer({ storage: this.str })

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, authMiddleware, this.upload.array('medias'), this.uploadsController.upload)
  }
}

export default UploadsRoute
