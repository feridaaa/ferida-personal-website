import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { handleApiError, NotFoundError } from '@/lib/errors';
import { updateBookMarkdown, deleteBookMarkdown } from '@/lib/markdown-writer';
import { downloadBookCover, deleteBookCover } from '@/lib/google-books';
import { BookFormSchema } from '@/lib/validation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Verify authentication
    const { error } = await requireAuth();
    if (error) return error;

    const body = await request.json();
    const slug = params.slug;

    // Validate input (allow partial updates)
    let validatedData;
    try {
      validatedData = BookFormSchema.partial().parse(body);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation error', details: err.errors },
          { status: 400 }
        );
      }
      throw err;
    }

    // Download new cover image if provided and is a URL
    if (validatedData.coverImage && validatedData.coverImage.startsWith('http')) {
      try {
        validatedData.coverImage = await downloadBookCover(validatedData.coverImage, slug);
      } catch (err) {
        console.error('Failed to download cover, using URL directly:', err);
      }
    }

    // Update markdown file
    await updateBookMarkdown(slug, validatedData);

    // Revalidate relevant paths
    revalidatePath('/books');
    revalidatePath('/');
    revalidatePath(`/books/${slug}`);

    return NextResponse.json({
      success: true,
      message: 'Book updated successfully',
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      throw new NotFoundError('Book not found');
    }
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Verify authentication
    const { error } = await requireAuth();
    if (error) return error;

    const slug = params.slug;

    // Get book to find cover image path
    const { getBookBySlug } = await import('@/lib/books');
    const book = await getBookBySlug(slug);

    if (!book) {
      throw new NotFoundError('Book not found');
    }

    // Delete cover image if it's a local file
    if (book.coverImage.startsWith('/images')) {
      await deleteBookCover(book.coverImage);
    }

    // Delete markdown file
    await deleteBookMarkdown(slug);

    // Revalidate relevant paths
    revalidatePath('/books');
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      message: 'Book deleted successfully',
    });
  } catch (error) {
    return handleApiError(error);
  }
}
