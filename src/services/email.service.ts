import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send password reset email
export const sendPasswordResetEmail = async (email: string, token: string): Promise<void> => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Password Reset',
    html: `
      <h1>Password Reset</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #0072FF; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
    `
  };
  
  await transporter.sendMail(mailOptions);
};

// Send contact form notification email
export const sendContactNotificationEmail = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> => {
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Contact Form Submission: ${data.subject}`,
    html: `
      <h1>New Contact Form Submission</h1>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, '<br>')}</p>
    `
  };
  
  await transporter.sendMail(mailOptions);
};

// Send newsletter
export const sendNewsletter = async (
  recipients: string[],
  subject: string,
  content: string
): Promise<void> => {
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
    to: process.env.EMAIL_FROM,
    bcc: recipients,
    subject,
    html: content
  };
  
  await transporter.sendMail(mailOptions);
};