import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { handleApiError } from '@/lib/errors';
import { createBookMarkdown } from '@/lib/markdown-writer';
import { downloadBookCover } from '@/lib/google-books';
import { BookFormSchema, WantToReadFormSchema } from '@/lib/validation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const { error, user } = await requireAuth();
    if (error) return error;

    const body = await request.json();

    // Validate input
    let validatedData;
    try {
      // Try full book schema first, then want-to-read schema
      if (body.status === 'want-to-read') {
        validatedData = WantToReadFormSchema.parse(body);
      } else {
        validatedData = BookFormSchema.parse(body);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation error', details: err.errors },
          { status: 400 }
        );
      }
      throw err;
    }

    // Download cover image if it's a URL
    let coverImagePath = validatedData.coverImage;
    if (coverImagePath.startsWith('http')) {
      try {
        coverImagePath = await downloadBookCover(coverImagePath, validatedData.slug);
      } catch (err) {
        console.error('Failed to download cover, using URL directly:', err);
        // Continue with the URL if download fails
      }
    }

    // Create markdown file
    const slug = await createBookMarkdown({
      ...validatedData,
      coverImage: coverImagePath,
    });

    // Revalidate relevant paths
    revalidatePath('/books');
    revalidatePath('/');
    revalidatePath(`/books/${slug}`);

    return NextResponse.json(
      {
        success: true,
        slug,
        message: 'Book created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const { error } = await requireAuth();
    if (error) return error;

    // Import books functions dynamically
    const { getAllBooks } = await import('@/lib/books');
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let books = await getAllBooks();

    // Filter by status if provided
    if (status) {
      books = books.filter(book => book.status === status);
    }

    return NextResponse.json({
      books,
      count: books.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
