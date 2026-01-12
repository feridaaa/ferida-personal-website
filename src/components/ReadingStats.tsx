import { getReadingStats } from '@/lib/books';

export default async function ReadingStats() {
  const stats = await getReadingStats();

  return (
    <div className="bg-white shadow-book rounded-lg p-6">
      <h2 className="text-2xl font-serif font-bold text-indigo-900 mb-6 text-center">
        Reading Progress
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600">{stats.booksThisYear}</div>
          <div className="text-sm text-gray-600">Books This Year</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600">{stats.goalProgress}%</div>
          <div className="text-sm text-gray-600">Goal Progress</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600">{stats.totalBooks}</div>
          <div className="text-sm text-gray-600">Total Books</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600">{stats.averageRating}</div>
          <div className="text-sm text-gray-600">Avg Rating</div>
        </div>
      </div>
      <div className="mt-6">
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-purple-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(stats.goalProgress, 100)}%` }}
          />
        </div>
        <p className="text-center text-sm text-gray-600 mt-2">
          {stats.booksThisYear} of 52 books read this year
        </p>
      </div>
    </div>
  );
}
