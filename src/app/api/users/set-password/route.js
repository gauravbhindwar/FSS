import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { connect } from '@/app/dbConfig/dbConfig'; // Adjust the import based on your project structure
import { User } from '@/lib/dbModels/dbModels'; // Adjust the import based on your project structure

export async function POST(req) {
  const body = await req.json();
  const { token, password } = body;

  if (!token || !password) {
    return NextResponse.json({ message: 'Token and password are required' }, { status: 400 });
  }

  try {
    // Connect to the database
    await connect();
    const verificationToken = token;
    console.log(verificationToken);

    // Find the user by verification token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password and remove the verification token
    user.password = hashedPassword;
    user.verificationToken = undefined;
    await user.save();

    return NextResponse.json({ message: 'Password set successfully' }, { status: 200 });
  } catch (error) {
    console.log('Error setting password:', error);
    return NextResponse.json({ message: 'Error setting password' }, { status: 500 });
  }
}