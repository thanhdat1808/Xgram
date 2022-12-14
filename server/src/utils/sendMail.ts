import nodemailer from 'nodemailer'
import { CustomError } from './custom-error'
import { statusCode } from './statuscode'

export const sendMail = async (email: string, subject: string, content: string) => {
  const adminEmail = process.env.EMAIL
  const adminPass = process.env.PASSWORD

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    requireTLS: true,
    auth: {
      user: adminEmail,
      pass: adminPass
    },
    logger: true
  })
  const mailOptions = {
    from: adminEmail,
    to: email,
    subject: subject,
    text: content
  }
  
  await transporter.sendMail(mailOptions, function (error) {
    if (error) {
      throw new CustomError('Email not sent', {}, statusCode.INTERNAL_SERVER_ERROR)
    } else {
      return
    }
  })
}
