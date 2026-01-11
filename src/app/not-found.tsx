import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center">
        <h1 className="text-6xl font-serif font-bold text-mahogany mb-4">
          404
        </h1>
        <h2 className="text-3xl font-serif font-bold text-charcoal mb-6">
          Page Not Found
        </h2>
        <p className="text-xl text-gray-700 mb-8">
          Looks like this page has gone missing, like a book misplaced on the shelf.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="btn-primary"
          >
            Go Home
          </Link>
          <Link
            href="/books"
            className="bg-forest text-white px-6 py-2 rounded hover:bg-forest/90 transition-colors"
          >
            Browse Books
          </Link>
        </div>
      </div>
    </div>
  );
}
