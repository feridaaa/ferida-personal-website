import { NextResponse } from 'next/server';
import { getAllBooks } from '@/lib/books';

export async function GET() {
  try {
    const books = await getAllBooks();
    return NextResponse.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}
