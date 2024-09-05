// pages/api/users/send-verification.js

import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = await req.json();

  // Generate a verification token
  const verificationToken = uuidv4();

  // Configure your email transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or another email service
    host:"smtp.gmail.com",
    port:587,
    secure:false, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Send the verification email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking the following link: http://your-domain.com/verify-email?token=${verificationToken}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Verification email sent successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send verification email.' });
  }
}