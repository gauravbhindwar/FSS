import { NextResponse } from 'next/server';

export async function POST() {
  // Clear server-side session or cookies if applicable
  const response = NextResponse.json({ success: true });
  response.headers.set('Set-Cookie', 'user=; Max-Age=0; path=/');
  return response;
}