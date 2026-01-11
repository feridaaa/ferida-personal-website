import Fuse from 'fuse.js';
import { BookReview } from './types';

const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.3 },
    { name: 'author', weight: 0.2 },
    { name: 'excerpt', weight: 0.2 },
    { name: 'tags', weight: 0.15 },
    { name: 'content', weight: 0.15 },
  ],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 2,
};

export function searchBooks(books: BookReview[], query: string): BookReview[] {
  if (!query || query.trim() === '') {
    return books;
  }

  const fuse = new Fuse(books, fuseOptions);
  const results = fuse.search(query);

  return results.map(result => result.item);
}
