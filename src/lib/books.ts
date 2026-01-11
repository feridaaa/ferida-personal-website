import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BookReview, TagWithCount, ReadingStats } from './types';
import { markdownToHtml } from './markdown';

const booksDirectory = path.join(process.cwd(), 'src/content/books');

export async function getAllBooks(): Promise<BookReview[]> {
  // Ensure the directory exists
  if (!fs.existsSync(booksDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(booksDirectory);
  const allBooksData = await Promise.all(
    fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(async fileName => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(booksDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        const htmlContent = await markdownToHtml(content);

        return {
          slug,
          content: htmlContent,
          title: data.title || '',
          author: data.author || '',
          dateRead: data.dateRead || '',
          datePublished: data.datePublished || '',
          rating: data.rating || 0,
          pages: data.pages || 0,
          coverImage: data.coverImage || '',
          tags: data.tags || [],
          genre: data.genre || '',
          status: data.status || 'completed',
          excerpt: data.excerpt || '',
          isbn: data.isbn,
          goodreadsUrl: data.goodreadsUrl,
        } as BookReview;
      })
  );

  // Sort by dateRead, newest first
  return allBooksData.sort((a, b) =>
    new Date(b.dateRead).getTime() - new Date(a.dateRead).getTime()
  );
}

export async function getBookBySlug(slug: string): Promise<BookReview | null> {
  const books = await getAllBooks();
  return books.find(book => book.slug === slug) || null;
}

export async function getRecentBooks(count: number = 8): Promise<BookReview[]> {
  const books = await getAllBooks();
  return books.slice(0, count);
}

export async function getAllTags(): Promise<TagWithCount[]> {
  const books = await getAllBooks();
  const tagCounts = new Map<string, number>();

  books.forEach(book => {
    book.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getBooksByTag(tag: string): Promise<BookReview[]> {
  const books = await getAllBooks();
  return books.filter(book =>
    book.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

export async function getReadingStats(): Promise<ReadingStats> {
  const books = await getAllBooks();
  const currentYear = new Date().getFullYear();

  const booksThisYear = books.filter(book =>
    new Date(book.dateRead).getFullYear() === currentYear
  ).length;

  const totalRating = books.reduce((sum, book) => sum + book.rating, 0);
  const averageRating = books.length > 0 ? totalRating / books.length : 0;

  const totalPages = books.reduce((sum, book) => sum + book.pages, 0);

  const goalProgress = (booksThisYear / 52) * 100;

  return {
    totalBooks: books.length,
    booksThisYear,
    averageRating: Math.round(averageRating * 10) / 10,
    totalPages,
    goalProgress: Math.round(goalProgress),
  };
}
