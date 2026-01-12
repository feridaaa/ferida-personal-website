'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import type { GoogleBookResult } from '@/lib/types'

interface BookSearchInputProps {
  onSelect: (book: GoogleBookResult) => void
  initialValue?: string
}

export default function BookSearchInput({ onSelect, initialValue = '' }: BookSearchInputProps) {
  const [query, setQuery] = useState(initialValue)
  const [results, setResults] = useState<GoogleBookResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [error, setError] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Debounced search
  useEffect(() => {
    if (query.length < 3) {
      setResults([])
      setShowDropdown(false)
      return
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(`/api/books/search?q=${encodeURIComponent(query)}`)

        if (!response.ok) {
          throw new Error('Search failed')
        }

        const data = await response.json()
        setResults(data.results || [])
        setShowDropdown(true)
      } catch (err) {
        setError('Failed to search books. Please try again.')
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (book: GoogleBookResult) => {
    onSelect(book)
    setQuery(book.title)
    setShowDropdown(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          placeholder="Search for a book (e.g., 'Atomic Habits')"
          className="w-full px-4 py-2 pr-10 border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg className="animate-spin h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {showDropdown && results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-lavender-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {results.map((book, index) => (
            <button
              key={`${book.title}-${index}`}
              onClick={() => handleSelect(book)}
              className="w-full flex gap-3 p-3 hover:bg-lavender-50 transition-colors text-left border-b border-lavender-100 last:border-b-0"
            >
              {book.thumbnail ? (
                <div className="relative h-20 w-14 flex-shrink-0 bg-gray-200 rounded">
                  <Image
                    src={book.thumbnail}
                    alt={book.title}
                    fill
                    className="object-cover rounded"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="h-20 w-14 flex-shrink-0 bg-gray-200 rounded flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              )}
              <div className="flex-grow min-w-0">
                <h4 className="font-medium text-indigo-900 truncate">{book.title}</h4>
                <p className="text-sm text-gray-600 truncate">
                  {book.authors.join(', ') || 'Unknown Author'}
                </p>
                {book.publishedDate && (
                  <p className="text-xs text-gray-500 mt-1">
                    Published: {book.publishedDate}
                  </p>
                )}
                {book.pageCount && (
                  <p className="text-xs text-gray-500">
                    {book.pageCount} pages
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {showDropdown && query.length >= 3 && !loading && results.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-lavender-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
          No results found. Try a different search term.
        </div>
      )}
    </div>
  )
}
