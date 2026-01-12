import Link from 'next/link'
import Image from 'next/image'
import { getAllBooks } from '@/lib/books'
import { format } from 'date-fns'

export default async function AdminDashboard() {
  const books = await getAllBooks()

  const stats = {
    total: books.length,
    completed: books.filter(b => b.status === 'completed').length,
    wantToRead: books.filter(b => b.status === 'want-to-read').length,
    currentlyReading: books.filter(b => b.status === 'currently-reading').length,
  }

  const recentBooks = books.slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-indigo-900">Dashboard</h1>
          <p className="text-slate mt-1">Manage your book reviews</p>
        </div>
        <Link
          href="/admin/books/new"
          className="btn-primary flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Book
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-book border border-lavender-200">
          <div className="text-sm text-gray-600 mb-1">Total Books</div>
          <div className="text-3xl font-bold text-purple-600">{stats.total}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-book border border-lavender-200">
          <div className="text-sm text-gray-600 mb-1">Completed</div>
          <div className="text-3xl font-bold text-purple-600">{stats.completed}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-book border border-lavender-200">
          <div className="text-sm text-gray-600 mb-1">Want to Read</div>
          <div className="text-3xl font-bold text-purple-600">{stats.wantToRead}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-book border border-lavender-200">
          <div className="text-sm text-gray-600 mb-1">Currently Reading</div>
          <div className="text-3xl font-bold text-purple-600">{stats.currentlyReading}</div>
        </div>
      </div>

      {/* Recent Books */}
      <div className="bg-white rounded-lg shadow-book border border-lavender-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-serif font-bold text-indigo-900">Recent Books</h2>
          <Link href="/books" className="text-sm text-purple-600 hover:text-purple-700">
            View All →
          </Link>
        </div>

        <div className="space-y-4">
          {recentBooks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No books yet. Add your first book to get started!</p>
            </div>
          ) : (
            recentBooks.map((book) => (
              <div
                key={book.slug}
                className="flex gap-4 p-4 border border-lavender-200 rounded-lg hover:bg-lavender-50 transition-colors"
              >
                <div className="relative h-24 w-16 flex-shrink-0 bg-gray-200 rounded">
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-serif font-bold text-indigo-900">{book.title}</h3>
                      <p className="text-sm text-gray-600">by {book.author}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        book.status === 'completed'
                          ? 'bg-purple-100 text-purple-700'
                          : book.status === 'want-to-read'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {book.status === 'completed'
                        ? 'Completed'
                        : book.status === 'want-to-read'
                        ? 'Want to Read'
                        : 'Currently Reading'}
                    </span>
                  </div>
                  <div className="mt-2 flex gap-4 text-sm text-gray-600">
                    <span>Rating: {book.rating}/5</span>
                    <span>Pages: {book.pages}</span>
                    {book.dateRead && (
                      <span>Read: {format(new Date(book.dateRead), 'MMM d, yyyy')}</span>
                    )}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Link
                      href={`/books/${book.slug}`}
                      className="text-sm text-purple-600 hover:text-purple-700"
                    >
                      View
                    </Link>
                    {book.status === 'want-to-read' && (
                      <Link
                        href={`/admin/books/${book.slug}/review`}
                        className="text-sm text-purple-600 hover:text-purple-700"
                      >
                        Add Review
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/books/new"
          className="bg-white p-6 rounded-lg shadow-book border border-lavender-200 hover:border-purple-600 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h3 className="font-serif font-bold text-indigo-900">Add New Book</h3>
              <p className="text-sm text-gray-600">Track a book you want to read</p>
            </div>
          </div>
        </Link>

        <Link
          href="/books"
          className="bg-white p-6 rounded-lg shadow-book border border-lavender-200 hover:border-purple-600 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-serif font-bold text-indigo-900">View Public Site</h3>
              <p className="text-sm text-gray-600">See how visitors see your reviews</p>
            </div>
          </div>
        </Link>

        <Link
          href="/tags"
          className="bg-white p-6 rounded-lg shadow-book border border-lavender-200 hover:border-purple-600 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <h3 className="font-serif font-bold text-indigo-900">Browse Tags</h3>
              <p className="text-sm text-gray-600">Explore books by category</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
