import { NextResponse } from 'next/server';
import { Admin } from '../../../lib/dbModels/dbModels';

export async function POST() {
  // Clear the cookie by setting 'Max-Age=0' and 'path=/'
  const response = NextResponse.json({ success: true });

  // Use NextResponse's cookie API to clear the 'user' cookie
  response.cookies.set("admin", '', {
    maxAge: 0, // Clear the cookie immediately
    path: '/', // Make sure the cookie is cleared site-wide
  });

  return response;
}
