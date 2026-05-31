import { NextResponse } from 'next/server';
import { mockAgents } from '@/lib/data';

export async function GET() {
  return NextResponse.json(mockAgents);
}
