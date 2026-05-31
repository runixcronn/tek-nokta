import { NextResponse } from 'next/server';
import { mockTestimonials } from '@/lib/data';

export async function GET() {
  return NextResponse.json(mockTestimonials);
}
