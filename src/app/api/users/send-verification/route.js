import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { connect } from '@/app/dbConfig/dbConfig';
import { User } from '@/lib/dbModels/dbModels';
import {NextRequest, NextResponse } from 'next/server';

export async function POST(req) {
  const body= await req.json();
  const {email} = body;

      // Log the email to ensure it's being received correctly
      console.log('Received email:', email);

      
    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

  // Generate a verification token
  const verificationToken = uuidv4();

  try {
    
  // Connect to the database
  await connect();

  // // Save the token to the user's record
  // const user = await User.findOneAndUpdate(
  //   { email },
  //   { $set: { verificationToken } },
  //   { new: true }
  // );

  const user = await User.findOne(
    {email}
  );

    // Log the user to see if it's found
    console.log('Found user:', user);

  if (!user) {
    return NextResponse.json({ message: 'User not found' },{status:404});
  }

      // Save the token to the user's record
      user.verificationToken = verificationToken;
      await user.save();
  

  // Send the verification email
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

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking the following link: ${process.env.BASE_URL}/verify-email?token=${verificationToken}`,
  };


    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Verification email sent' },{status:202});
  } catch (error) {
    console.log('Error sending email:', error);
    return NextResponse.json({ message: 'Error sending email' },{status:500});
  }
}