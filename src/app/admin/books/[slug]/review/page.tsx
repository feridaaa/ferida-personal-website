'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import RichTextEditor from '@/components/admin/RichTextEditor'
import Image from 'next/image'
import type { BookReview } from '@/lib/types'

export default function ReviewBookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [book, setBook] = useState<BookReview | null>(null)

  const [formData, setFormData] = useState({
    rating: 0,
    dateRead: new Date().toISOString().split('T')[0],
    content: '',
    excerpt: '',
    status: 'completed' as const,
  })

  useEffect(() => {
    async function fetchBook() {
      try {
        const response = await fetch('/api/books')
        if (!response.ok) throw new Error('Failed to fetch books')

        const data = await response.json()
        const foundBook = data.find((b: BookReview) => b.slug === slug)

        if (!foundBook) {
          setError('Book not found')
          return
        }

        setBook(foundBook)

        // Pre-fill form if book already has data
        setFormData({
          rating: foundBook.rating || 0,
          dateRead: foundBook.dateRead || new Date().toISOString().split('T')[0],
          content: foundBook.content || '',
          excerpt: foundBook.excerpt || '',
          status: 'completed',
        })
      } catch (err: any) {
        setError(err.message || 'Failed to load book')
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/books/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save review')
      }

      router.push('/admin/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-slate">Loading book...</p>
        </div>
      </div>
    )
  }

  if (error && !book) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
        <button
          onClick={() => router.back()}
          className="mt-4 text-purple-600 hover:text-purple-700"
        >
          ← Go Back
        </button>
      </div>
    )
  }

  if (!book) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="text-purple-600 hover:text-purple-700 mb-4 flex items-center gap-2"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-serif font-bold text-indigo-900">Add Review</h1>
        <p className="text-slate mt-1">Write your review for this book</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Book Info */}
      <div className="bg-white p-6 rounded-lg shadow-book border border-lavender-200 mb-6">
        <div className="flex gap-6">
          <div className="relative h-48 w-32 flex-shrink-0 bg-gray-200 rounded">
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              className="object-cover rounded"
            />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-indigo-900">{book.title}</h2>
            <p className="text-lg text-gray-600 mt-1">by {book.author}</p>
            <div className="mt-4 space-y-1 text-sm text-gray-600">
              <p>Genre: {book.genre}</p>
              <p>Pages: {book.pages}</p>
              {book.isbn && <p>ISBN: {book.isbn}</p>}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {book.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-book border border-lavender-200 space-y-4">
          <h2 className="text-xl font-serif font-bold text-indigo-900">Your Review</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate mb-1">
                Rating * (0-5)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                  min="0"
                  max="5"
                  step="0.5"
                  required
                  className="w-32 px-4 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <div className="flex text-2xl text-purple-600">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>
                      {i < Math.floor(formData.rating)
                        ? '★'
                        : i < formData.rating
                        ? '½'
                        : '☆'}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate mb-1">
                Date Read *
              </label>
              <input
                type="date"
                value={formData.dateRead}
                onChange={(e) => setFormData({ ...formData, dateRead: e.target.value })}
                required
                className="w-full px-4 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate mb-1">
              Excerpt * (Brief summary)
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              required
              rows={3}
              maxLength={500}
              placeholder="A brief description or summary of the book"
              className="w-full px-4 py-2 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.excerpt.length}/500 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate mb-2">
              Review Content * (Markdown supported)
            </label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
            />
            <p className="text-xs text-gray-500 mt-1">
              Write your thoughts, insights, and reflections on the book
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving Review...' : 'Save Review'}
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
