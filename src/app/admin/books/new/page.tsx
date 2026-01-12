'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BookSearchInput from '@/components/admin/BookSearchInput'
import Image from 'next/image'
import type { GoogleBookResult } from '@/lib/types'
import { extractGenreFromCategories } from '@/lib/google-books'

export default function NewBookPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedBook, setSelectedBook] = useState<GoogleBookResult | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    slug: '',
    dateRead: '',
    datePublished: new Date().toISOString().split('T')[0],
    rating: 0,
    pages: 0,
    coverImage: '',
    tags: [] as string[],
    genre: '',
    status: 'want-to-read' as const,
    excerpt: '',
    isbn: '',
    goodreadsUrl: '',
  })

  const [tagInput, setTagInput] = useState('')

  const handleBookSelect = (book: GoogleBookResult) => {
    setSelectedBook(book)

    // Auto-populate form fields
    const slug = book.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    const genre = extractGenreFromCategories(book.categories)

    // Extract tags from categories
    const tags = book.categories?.slice(0, 3).map(cat =>
      cat.split(' / ').pop()?.toLowerCase() || ''
    ).filter(Boolean) || []

    setFormData({
      ...formData,
      title: book.title,
      author: book.authors[0] || '',
      slug,
      pages: book.pageCount || 0,
      coverImage: book.thumbnail || '',
      genre,
      tags,
      excerpt: book.description?.substring(0, 300) || '',
      isbn: book.isbn || '',
    })
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim().toLowerCase())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim().toLowerCase()],
      })
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create book')
      }

      router.push('/admin/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-indigo-900">Add New Book</h1>
        <p className="text-slate mt-1">Search for a book or enter details manually</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Book Search */}
        <div className="bg-white p-6 rounded-lg shadow-book border border-lavender-200">
          <label className="block text-sm font-medium text-slate mb-2">
            Search Google Books
          </label>
          <BookSearchInput onSelect={handleBookSelect} />
          <p className="text-xs text-gray-500 mt-1">
            Search for a book to auto-populate the form
          </p>
        </div>

        {/* Form Fields */}
        <div className="bg-white p-6 rounded-lg shadow-book border border-lavender-200 space-y-4">
          <h2 className="text-xl font-serif font-bold text-indigo-900 mb-4">Book Details</h2>

          {/* Cover Preview */}
          {formData.coverImage && (
            <div className="flex items-center gap-4 mb-4">
              <div className="relative h-32 w-24 bg-gray-200 rounded">
                <Image
                  src={formData.coverImage}
                  alt="Book cover"
                  fill
                  className="object-cover rounded"
                  unoptimized
                />
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, coverImage: '' })}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Remove Cover
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate mb-1">
                Author *
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
                className="w-full px-4 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate mb-1">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                pattern="[a-z0-9-]+"
                className="w-full px-4 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <p className="text-xs text-gray-500 mt-1">Lowercase letters, numbers, and hyphens only</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate mb-1">
                Genre *
              </label>
              <input
                type="text"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                required
                className="w-full px-4 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate mb-1">
                Pages
              </label>
              <input
                type="number"
                value={formData.pages}
                onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) || 0 })}
                min="0"
                className="w-full px-4 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="want-to-read">Want to Read</option>
                <option value="currently-reading">Currently Reading</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate mb-1">
                Date Read
              </label>
              <input
                type="date"
                value={formData.dateRead}
                onChange={(e) => setFormData({ ...formData, dateRead: e.target.value })}
                className="w-full px-4 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate mb-1">
                Rating (0-5)
              </label>
              <input
                type="number"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                min="0"
                max="5"
                step="0.5"
                className="w-full px-4 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          {/* Cover Image URL */}
          <div>
            <label className="block text-sm font-medium text-slate mb-1">
              Cover Image URL
            </label>
            <input
              type="url"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              placeholder="https://example.com/cover.jpg"
              className="w-full px-4 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate mb-1">
              Tags *
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add a tag"
                className="flex-grow px-4 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-purple-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-slate mb-1">
              Excerpt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
              maxLength={500}
              placeholder="Brief description or excerpt"
              className="w-full px-4 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.excerpt.length}/500 characters</p>
          </div>

          {/* Optional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate mb-1">
                ISBN (Optional)
              </label>
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                className="w-full px-4 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate mb-1">
                Goodreads URL (Optional)
              </label>
              <input
                type="url"
                value={formData.goodreadsUrl}
                onChange={(e) => setFormData({ ...formData, goodreadsUrl: e.target.value })}
                className="w-full px-4 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding Book...' : 'Add Book'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
