import { NextRequest, NextResponse } from 'next/server';
import { searchGoogleBooks } from '@/lib/google-books';
import { handleApiError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    const results = await searchGoogleBooks(query);

    return NextResponse.json({
      results,
      count: results.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
