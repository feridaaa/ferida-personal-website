import { getRecentBooks } from '@/lib/books';
import BookCard from '@/components/BookCard';
import ReadingStats from '@/components/ReadingStats';
import Link from 'next/link';

export default async function Home() {
  const recentBooks = await getRecentBooks(8);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-5xl font-serif font-bold text-mahogany mb-4">
          Welcome to My Book Reviews
        </h1>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto">
          Join me on my journey to read 52 books a year. One book, one review, one thought at a time.
        </p>
      </section>

      {/* Reading Stats */}
      <section className="mb-12">
        <ReadingStats />
      </section>

      {/* Recent Reviews */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-mahogany">
            Recent Reviews
          </h2>
          <Link
            href="/books"
            className="text-forest hover:text-mahogany transition-colors font-medium"
          >
            View All Books →
          </Link>
        </div>

        {recentBooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              No book reviews yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentBooks.map(book => (
              <BookCard key={book.slug} book={book} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
