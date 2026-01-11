# Personal Book Review Website

A beautiful, book-themed personal website for sharing book reviews and tracking reading progress. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 📚 **Book Reviews**: Write and publish markdown-based book reviews with rich formatting
- 🎨 **Book-Themed Design**: Beautiful library-inspired aesthetic with custom color palette
- 🔍 **Search Functionality**: Search books by title, author, content, or tags
- 🏷️ **Tag System**: Organize books by genre, theme, and category
- 📊 **Reading Statistics**: Track progress toward your 52-book yearly goal
- 🚀 **Performance**: Built with Next.js for optimal speed and SEO
- 📱 **Responsive**: Works perfectly on mobile, tablet, and desktop

## Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Content**: Markdown files with frontmatter
- **Search**: [Fuse.js](https://fusejs.io/) for fuzzy search
- **Deployment**: Optimized for [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ferida-personal-website.git
cd ferida-personal-website
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Adding Book Reviews

Book reviews are stored as markdown files in `src/content/books/`. To add a new review:

1. Create a new markdown file: `YYYY-MM-book-title.md`
2. Add frontmatter with book metadata:

```markdown
---
title: "Book Title"
author: "Author Name"
slug: "book-title"
dateRead: "2026-01-15"
datePublished: "2026-01-16"
rating: 4.5
pages: 320
coverImage: "/images/book-covers/book-title.jpg"
tags: ["fiction", "mystery", "thriller"]
genre: "Fiction"
status: "completed"
excerpt: "A brief summary for cards and SEO"
---

## My Thoughts

Your review content here...

## Key Takeaways

- Point 1
- Point 2

## Memorable Quotes

> "A memorable quote from the book"

## Would I Recommend?

Your recommendation...
```

3. Add a book cover image to `public/images/book-covers/`
4. The site will automatically include your new review!

## Project Structure

```
├── src/
│   ├── app/                  # Next.js app directory
│   │   ├── books/           # Book pages
│   │   ├── tags/            # Tag pages
│   │   ├── search/          # Search page
│   │   └── api/             # API routes
│   ├── components/          # React components
│   ├── lib/                 # Utilities and data fetching
│   └── content/
│       └── books/           # Markdown book reviews
├── public/
│   └── images/
│       └── book-covers/     # Book cover images
└── tailwind.config.ts       # Tailwind configuration
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Customization

### Colors

Edit the color palette in `tailwind.config.ts`:

```typescript
colors: {
  parchment: '#FFF8DC',    // Background
  mahogany: '#704214',     // Primary
  forest: '#2C5F2D',       // Secondary
  gold: '#D4AF37',         // Accent
  charcoal: '#2B2B2B'      // Text
}
```

### Fonts

Fonts are configured in `src/app/layout.tsx`. Current fonts:
- **Serif**: Crimson Text (for headings and body)
- **Sans**: Inter (for UI elements)

### Reading Goal

The default reading goal is 52 books per year. To change this, edit the calculation in `src/lib/books.ts`:

```typescript
const goalProgress = (booksThisYear / 52) * 100; // Change 52 to your goal
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com/)
3. Vercel will automatically detect Next.js and configure the build
4. Your site will be live!

### Deploy Elsewhere

Build the static site:
```bash
npm run build
```

The build output will be in the `.next` directory.

## License

MIT License - feel free to use this for your own book review website!

## Acknowledgments

- Design inspired by classic libraries and book aesthetics
- Built following Next.js best practices
- Markdown processing with remark
