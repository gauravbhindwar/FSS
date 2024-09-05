import { NextResponse } from 'next/server';
import { connect } from '@/app/dbConfig/dbConfig';
import {User} from '@/lib/dbModels/dbModels';
import bcrypt from 'bcrypt';

export async function POST(request) {
  const { email, password } = await request.json();

  try {
    await connect();
    const user = await User.findOne({ email });

    if (user && user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ success: false }, { status: 401 });
      }
    } else {
      return NextResponse.json({ success: false }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Error logging in" }, { status: 500 });
  }
}
