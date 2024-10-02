// /app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Sample response
  const users = [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }];

  // Return the response as JSON
  return NextResponse.json(users);
}
