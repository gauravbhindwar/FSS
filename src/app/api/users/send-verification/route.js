import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { connect } from '@/app/dbConfig/dbConfig';
import {User} from '@/lib/dbModels/dbModels';

export async function POST(req) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { email } = await req.json();

    // Generate a verification token
    const verificationToken = uuidv4();

    // Connect to the database
    await connect();

    // Save the token to the user's record
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { verificationToken } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Configure your email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: "smtp.gmail.com",
      port: 587,
      secure: false, 
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
      text: `Please verify your email by clicking the following link: ${process.env.YOUR_DOMAIN}/verify-email?token=${verificationToken}`,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Verification email sent successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ message: 'Failed to send verification email.' }, { status: 500 });
  }
}
