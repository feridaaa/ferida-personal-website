import { promises as fs } from 'fs';
import { join } from 'path';
import sharp from 'sharp';
import type { GoogleBookResult } from './types';

const PUBLIC_DIR = join(process.cwd(), 'public');
const COVERS_DIR = join(PUBLIC_DIR, 'images', 'book-covers');

export async function searchGoogleBooks(query: string): Promise<GoogleBookResult[]> {
  try {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const url = apiKey
      ? `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}&maxResults=10`
      : `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Google Books API request failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return [];
    }

    return data.items.map((item: any) => {
      const volumeInfo = item.volumeInfo || {};
      const imageLinks = volumeInfo.imageLinks || {};

      // Upgrade HTTP to HTTPS for thumbnails
      let thumbnail = imageLinks.thumbnail || imageLinks.smallThumbnail;
      if (thumbnail) {
        thumbnail = thumbnail.replace('http://', 'https://');
        // Get larger image if available
        thumbnail = thumbnail.replace('&zoom=1', '&zoom=2');
      }

      // Get ISBN (prefer ISBN_13 over ISBN_10)
      const identifiers = volumeInfo.industryIdentifiers || [];
      const isbn13 = identifiers.find((id: any) => id.type === 'ISBN_13');
      const isbn10 = identifiers.find((id: any) => id.type === 'ISBN_10');
      const isbn = isbn13?.identifier || isbn10?.identifier;

      return {
        title: volumeInfo.title || 'Unknown Title',
        authors: volumeInfo.authors || [],
        thumbnail,
        description: volumeInfo.description,
        pageCount: volumeInfo.pageCount,
        publishedDate: volumeInfo.publishedDate,
        isbn,
        categories: volumeInfo.categories || [],
      };
    });
  } catch (error) {
    console.error('Error searching Google Books:', error);
    throw error;
  }
}

export async function downloadBookCover(url: string, slug: string): Promise<string> {
  try {
    // Ensure covers directory exists
    await fs.mkdir(COVERS_DIR, { recursive: true });

    // Fetch the image
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to download cover image: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process image with sharp
    // Resize to consistent dimensions and optimize
    const processedImage = await sharp(buffer)
      .resize(400, 600, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({
        quality: 85,
        progressive: true,
      })
      .toBuffer();

    // Generate filename
    const filename = `${slug}.jpg`;
    const filepath = join(COVERS_DIR, filename);

    // Write the processed image
    await fs.writeFile(filepath, processedImage);

    // Return the public path
    return `/images/book-covers/${filename}`;
  } catch (error) {
    console.error('Error downloading book cover:', error);
    throw error;
  }
}

export async function deleteBookCover(coverImagePath: string): Promise<void> {
  try {
    // Extract filename from path (e.g., /images/book-covers/slug.jpg -> slug.jpg)
    const filename = coverImagePath.split('/').pop();

    if (!filename) {
      return;
    }

    const filepath = join(COVERS_DIR, filename);

    // Check if file exists before deleting
    try {
      await fs.access(filepath);
      await fs.unlink(filepath);
    } catch (err: any) {
      // File doesn't exist, ignore
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }
  } catch (error) {
    console.error('Error deleting book cover:', error);
    // Don't throw, just log the error
  }
}

export function extractGenreFromCategories(categories: string[] | undefined): string {
  if (!categories || categories.length === 0) {
    return 'General';
  }

  // Return the first category, simplified
  const category = categories[0];

  // Common simplifications
  const genreMap: Record<string, string> = {
    'Fiction / General': 'Fiction',
    'Fiction / Literary': 'Literary Fiction',
    'Fiction / Historical': 'Historical Fiction',
    'Fiction / Mystery & Detective': 'Mystery',
    'Fiction / Science Fiction': 'Science Fiction',
    'Fiction / Fantasy': 'Fantasy',
    'Fiction / Romance': 'Romance',
    'Fiction / Thriller': 'Thriller',
    'Nonfiction / Biography & Autobiography': 'Biography',
    'Self-Help': 'Self-Help',
    'Business & Economics': 'Business',
    'Psychology': 'Psychology',
    'History': 'History',
    'Science': 'Science',
    'Philosophy': 'Philosophy',
  };

  return genreMap[category] || category.split(' / ')[0] || 'General';
}
