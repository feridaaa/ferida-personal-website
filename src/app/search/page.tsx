'use client';

import { useState, useEffect } from 'react';
import { BookReview } from '@/lib/types';
import BookCard from '@/components/BookCard';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BookReview[]>([]);
  const [allBooks, setAllBooks] = useState<BookReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch('/api/books');
        const data = await response.json();
        setAllBooks(data);
        setResults(data);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBooks();
  }, []);

  useEffect(() => {
    if (query.trim() === '') {
      setResults(allBooks);
      return;
    }

    const searchQuery = query.toLowerCase();
    const filtered = allBooks.filter(book =>
      book.title.toLowerCase().includes(searchQuery) ||
      book.author.toLowerCase().includes(searchQuery) ||
      book.excerpt.toLowerCase().includes(searchQuery) ||
      book.tags.some(tag => tag.toLowerCase().includes(searchQuery))
    );

    setResults(filtered);
  }, [query, allBooks]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold text-mahogany mb-8">
        Search Books
      </h1>

      <div className="mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, author, tags, or content..."
          className="w-full px-6 py-4 text-lg border-2 border-mahogany rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
          autoFocus
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">Loading books...</p>
        </div>
      ) : (
        <>
          <p className="text-lg text-gray-700 mb-8">
            {results.length} {results.length === 1 ? 'book' : 'books'} found
            {query && ` for "${query}"`}
          </p>

          {results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">
                No books found. Try a different search term.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {results.map(book => (
                <BookCard key={book.slug} book={book} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
