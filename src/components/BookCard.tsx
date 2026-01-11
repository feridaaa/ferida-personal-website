import Link from 'next/link';
import Image from 'next/image';
import { BookReview } from '@/lib/types';
import { format } from 'date-fns';

interface BookCardProps {
  book: BookReview;
}

export default function BookCard({ book }: BookCardProps) {
  const formattedDate = format(new Date(book.dateRead), 'MMM d, yyyy');

  return (
    <Link href={`/books/${book.slug}`}>
      <div className="book-card h-full flex flex-col">
        <div className="relative h-64 w-full bg-gray-200">
          <Image
            src={book.coverImage}
            alt={`Cover of ${book.title}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-xl font-serif font-bold text-mahogany mb-1 line-clamp-2">
            {book.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            by {book.author}
          </p>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center text-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>
                  {i < Math.floor(book.rating) ? '★' : i < book.rating ? '½' : '☆'}
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-600">{book.rating}/5</span>
          </div>
          <p className="text-sm text-gray-700 mb-3 line-clamp-3 flex-grow">
            {book.excerpt}
          </p>
          <div className="flex flex-wrap gap-2 mb-2">
            {book.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="text-xs bg-forest text-white px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Read on {formattedDate}
          </p>
        </div>
      </div>
    </Link>
  );
}
