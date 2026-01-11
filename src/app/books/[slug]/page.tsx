import { getAllBooks, getBookBySlug } from '@/lib/books';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import type { Metadata } from 'next';

interface BookPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const books = await getAllBooks();
  return books.map(book => ({
    slug: book.slug,
  }));
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBookBySlug(slug);

  if (!book) {
    return {
      title: 'Book Not Found',
    };
  }

  return {
    title: `${book.title} by ${book.author} | Book Reviews`,
    description: book.excerpt,
    openGraph: {
      title: `${book.title} by ${book.author}`,
      description: book.excerpt,
      images: [book.coverImage],
    },
  };
}

export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);

  if (!book) {
    notFound();
  }

  const formattedDate = format(new Date(book.dateRead), 'MMMM d, yyyy');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="book-page">
        {/* Book Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-1">
            <div className="relative aspect-[2/3] w-full max-w-sm mx-auto">
              <Image
                src={book.coverImage}
                alt={`Cover of ${book.title}`}
                fill
                className="object-cover rounded-lg shadow-lg"
                priority
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <h1 className="text-4xl font-serif font-bold text-mahogany mb-2">
              {book.title}
            </h1>
            <p className="text-2xl text-gray-700 mb-4">
              by {book.author}
            </p>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center text-gold text-2xl">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>
                    {i < Math.floor(book.rating) ? '★' : i < book.rating ? '½' : '☆'}
                  </span>
                ))}
              </div>
              <span className="text-xl text-gray-700">{book.rating}/5</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <span className="font-semibold text-mahogany">Genre:</span> {book.genre}
              </div>
              <div>
                <span className="font-semibold text-mahogany">Pages:</span> {book.pages}
              </div>
              <div>
                <span className="font-semibold text-mahogany">Date Read:</span> {formattedDate}
              </div>
              <div>
                <span className="font-semibold text-mahogany">Status:</span>{' '}
                {book.status === 'completed' ? 'Completed' : book.status === 'currently-reading' ? 'Currently Reading' : 'Did Not Finish'}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {book.tags.map(tag => (
                <Link key={tag} href={`/tags/${tag.toLowerCase()}`}>
                  <span className="tag-badge">
                    {tag}
                  </span>
                </Link>
              ))}
            </div>

            {book.goodreadsUrl && (
              <a
                href={book.goodreadsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-forest hover:text-mahogany transition-colors underline"
              >
                View on Goodreads →
              </a>
            )}
          </div>
        </div>

        {/* Review Content */}
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: book.content }} />
        </div>

        {/* Back Link */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/books"
            className="text-forest hover:text-mahogany transition-colors font-medium"
          >
            ← Back to All Books
          </Link>
        </div>
      </div>
    </div>
  );
}
