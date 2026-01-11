import { getAllTags, getBooksByTag } from '@/lib/books';
import BookCard from '@/components/BookCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map(({ tag }) => ({
    tag: tag.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const books = await getBooksByTag(tag);

  return {
    title: `${tag.charAt(0).toUpperCase() + tag.slice(1)} Books | Book Reviews`,
    description: `Browse ${books.length} book reviews tagged with ${tag}`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const books = await getBooksByTag(tag);

  if (books.length === 0) {
    notFound();
  }

  const displayTag = tag.charAt(0).toUpperCase() + tag.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link
          href="/tags"
          className="text-forest hover:text-mahogany transition-colors font-medium mb-4 inline-block"
        >
          ← All Tags
        </Link>
        <h1 className="text-4xl font-serif font-bold text-mahogany mb-4">
          {displayTag}
        </h1>
        <p className="text-lg text-gray-700">
          {books.length} {books.length === 1 ? 'book' : 'books'} tagged with {displayTag}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {books.map(book => (
          <BookCard key={book.slug} book={book} />
        ))}
      </div>
    </div>
  );
}
