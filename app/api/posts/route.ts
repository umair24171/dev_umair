import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';

export async function GET() {
  const posts = getAllPosts().slice(0, 3);
  return NextResponse.json(posts);
}
