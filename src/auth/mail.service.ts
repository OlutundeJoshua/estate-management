import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // or another SMTP provider
      auth: { user: process.env.SMTP_USER || 'test@gmail.com', pass: process.env.SMTP_PASS || '' },
    });
  }

  async sendMail(options: { to: string; subject: string; text: string }) {
    console.log('Sending email with options:', options);
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('SMTP_PASS:', process.env.SMTP_PASS);
    return this.transporter.sendMail({
      from: process.env.SMTP_USER || 'test@gmail.com',
      ...options,
    });
  }
}
