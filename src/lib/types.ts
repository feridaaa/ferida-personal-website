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
  status: 'completed' | 'currently-reading' | 'dnf';
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
