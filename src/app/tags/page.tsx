import { getAllTags } from '@/lib/books';
import Link from 'next/link';

export const metadata = {
  title: 'All Tags | Book Reviews',
  description: 'Browse books by tags and categories',
};

export default async function TagsPage() {
  const tags = await getAllTags();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold text-mahogany mb-8">
        Browse by Tags
      </h1>

      <p className="text-lg text-gray-700 mb-8">
        Explore books organized by genre, theme, and category
      </p>

      {tags.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">
            No tags yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {tags.map(({ tag, count }) => (
            <Link key={tag} href={`/tags/${tag.toLowerCase()}`}>
              <div className="bg-white shadow-book rounded-lg px-6 py-4 hover:scale-105 transition-transform">
                <div className="text-xl font-serif font-bold text-mahogany mb-1">
                  {tag}
                </div>
                <div className="text-sm text-gray-600">
                  {count} {count === 1 ? 'book' : 'books'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
