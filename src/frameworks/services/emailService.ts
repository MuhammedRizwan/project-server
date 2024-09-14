// /frameworks/services/emailService.ts
import nodemailer from 'nodemailer';
import configKeys from '../../config';

export class EmailService {
  private transporter: nodemailer.Transporter;
  
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', 
      port: 587,
      secure: false,
      auth: {
        user: configKeys.MAIL_SERVICE, 
        pass: configKeys.MAIL_PASSWORD,
      },
    });
  }

  async sendVerificationEmail(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: configKeys.MAIL_SERVICE,
      to: email,
      subject: 'Email Verification',
      text: `Your OTP code is: ${otp}. Please use this code to verify your email.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
          <h2 style="color: #333;">Verify Your Email</h2>
          <p style="font-size: 16px; color: #555;">
            Thank you for signing up! To complete your registration, please use the OTP code below to verify your email address.
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <p style="font-size: 24px; font-weight: bold; color: #007BFF; letter-spacing: 2px;">${otp}</p>
          </div>
          <p style="font-size: 16px; color: #555;">
            Please enter this OTP in the application to verify your account. This code will expire in 10 minutes.
          </p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
          <p style="font-size: 14px; color: #999;">
            If you didn't request this, please ignore this email. Your email will remain unverified.
          </p>
        </div>
      `,
    };

     try {
        await this.transporter.sendMail(mailOptions);
      } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
      }
  }
}
