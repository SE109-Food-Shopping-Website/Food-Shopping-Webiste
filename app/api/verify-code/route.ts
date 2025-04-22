import { NextRequest, NextResponse } from 'next/server';
import { getCode } from '@/lib/resetCodeStore';

export async function POST(req: NextRequest) {
  const { email, code } = await req.json();
  const stored = getCode(email);

  if (!stored) return NextResponse.json({ message: 'No code found' }, { status: 400 });
  if (Date.now() > stored.expiresAt)
    return NextResponse.json({ message: 'Code expired' }, { status: 400 });
  if (stored.code !== code)
    return NextResponse.json({ message: 'Invalid code' }, { status: 400 });

  return NextResponse.json({ message: 'Code verified' });
}
