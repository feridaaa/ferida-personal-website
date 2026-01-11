import { getAllBooks } from '@/lib/books';
import BookCard from '@/components/BookCard';

export const metadata = {
  title: 'All Books | Book Reviews',
  description: 'Browse all book reviews',
};

export default async function BooksPage() {
  const books = await getAllBooks();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold text-mahogany mb-8">
        All Books
      </h1>

      <p className="text-lg text-gray-700 mb-8">
        {books.length} {books.length === 1 ? 'book' : 'books'} reviewed
      </p>

      {books.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">
            No book reviews yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map(book => (
            <BookCard key={book.slug} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
