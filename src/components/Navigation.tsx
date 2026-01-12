import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-white shadow-md border-b-2 border-purple-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-serif font-bold text-purple-600 hover:text-purple-700 transition-colors">
              Book Reviews
            </Link>
          </div>
          <div className="flex space-x-8">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href="/books" className="nav-link">
              All Books
            </Link>
            <Link href="/tags" className="nav-link">
              Tags
            </Link>
            <Link href="/search" className="nav-link">
              Search
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
