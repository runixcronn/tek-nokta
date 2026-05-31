import { NextResponse } from 'next/server';
import { mockProperties } from '@/lib/data';

export async function GET() {
  return NextResponse.json(mockProperties);
}
