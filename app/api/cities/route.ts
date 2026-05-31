import { NextResponse } from 'next/server';
import { mockCities } from '@/lib/data';

export async function GET() {
  return NextResponse.json(mockCities);
}
