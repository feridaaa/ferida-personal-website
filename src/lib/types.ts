export interface BookReview {
  title: string;
  author: string;
  slug: string;
  dateRead: string;
  datePublished: string;
  rating: number;
  pages: number;
  coverImage: string;
  tags: string[];
  genre: string;
  status: 'completed' | 'currently-reading' | 'want-to-read' | 'dnf';
  excerpt: string;
  content: string;
  isbn?: string;
  goodreadsUrl?: string;
}

export interface TagWithCount {
  tag: string;
  count: number;
}

export interface ReadingStats {
  totalBooks: number;
  booksThisYear: number;
  averageRating: number;
  totalPages: number;
  goalProgress: number; // Percentage toward 52 books
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Only for credentials auth
  image?: string; // From OAuth providers
  role: 'admin' | 'user';
  createdAt: string;
}

export interface GoogleBookResult {
  title: string;
  authors: string[];
  thumbnail?: string;
  description?: string;
  pageCount?: number;
  publishedDate?: string;
  isbn?: string;
  categories?: string[];
}
