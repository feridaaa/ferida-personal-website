'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

interface AdminNavigationProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export default function AdminNavigation({ user }: AdminNavigationProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/books/new', label: 'Add Book' },
    { href: '/books', label: 'View Site' },
  ]

  return (
    <nav className="bg-white shadow-md border-b-2 border-purple-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/admin/dashboard" className="text-2xl font-serif font-bold text-purple-600">
              Admin Panel
            </Link>

            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-purple-600 text-white'
                      : 'text-slate hover:bg-lavender-100'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-sm text-slate">
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-gray-500">{user.email}</div>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
