import { promises as fs } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import type { BookReview } from './types';

const BOOKS_DIR = join(process.cwd(), 'src', 'content', 'books');

interface BookFormData {
  title: string;
  author: string;
  slug: string;
  dateRead: string;
  datePublished: string;
  rating: number;
  pages: number;
  coverImage: string;
  tags: string[];
  genre: string;
  status: 'completed' | 'currently-reading' | 'want-to-read' | 'dnf';
  excerpt: string;
  content?: string;
  isbn?: string;
  goodreadsUrl?: string;
}

function escapeYamlString(str: string): string {
  // If string contains special characters, wrap in quotes and escape quotes
  if (str.includes(':') || str.includes('#') || str.includes('"') || str.includes("'")) {
    return `"${str.replace(/"/g, '\\"')}"`;
  }
  return str;
}

function generateFrontmatter(data: BookFormData): string {
  const frontmatter: Record<string, any> = {
    title: escapeYamlString(data.title),
    author: escapeYamlString(data.author),
    slug: data.slug,
    dateRead: data.dateRead,
    datePublished: data.datePublished,
    rating: data.rating,
    pages: data.pages,
    coverImage: data.coverImage,
    tags: data.tags,
    genre: escapeYamlString(data.genre),
    status: data.status,
    excerpt: escapeYamlString(data.excerpt),
  };

  if (data.isbn) {
    frontmatter.isbn = data.isbn;
  }

  if (data.goodreadsUrl) {
    frontmatter.goodreadsUrl = data.goodreadsUrl;
  }

  // Convert to YAML manually for better control
  let yaml = '';
  for (const [key, value] of Object.entries(frontmatter)) {
    if (Array.isArray(value)) {
      yaml += `${key}:\n`;
      value.forEach(item => {
        yaml += `  - "${item}"\n`;
      });
    } else if (typeof value === 'string' && value.startsWith('"')) {
      yaml += `${key}: ${value}\n`;
    } else {
      yaml += `${key}: ${value}\n`;
    }
  }

  return yaml;
}

export async function createBookMarkdown(data: BookFormData): Promise<string> {
  // Ensure books directory exists
  try {
    await fs.access(BOOKS_DIR);
  } catch {
    await fs.mkdir(BOOKS_DIR, { recursive: true });
  }

  // Generate unique filename
  const date = data.dateRead || new Date().toISOString().split('T')[0];
  const [year, month] = date.split('-');
  const randomId = Math.random().toString(36).substring(2, 6);
  const filename = `${year}-${month}-${data.slug}-${randomId}.md`;
  const filepath = join(BOOKS_DIR, filename);

  // Check if file already exists
  try {
    await fs.access(filepath);
    throw new Error(`File already exists: ${filename}`);
  } catch (err: any) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }

  // Generate markdown content
  const frontmatter = generateFrontmatter(data);
  const content = data.content || '';

  const markdown = `---\n${frontmatter}---\n\n${content}`;

  // Write to temporary file first, then rename (atomic operation)
  const tmpFilepath = filepath + '.tmp';
  await fs.writeFile(tmpFilepath, markdown, 'utf-8');
  await fs.rename(tmpFilepath, filepath);

  return data.slug;
}

export async function updateBookMarkdown(
  slug: string,
  updates: Partial<BookFormData>
): Promise<void> {
  // Find the book file by slug
  const files = await fs.readdir(BOOKS_DIR);
  const bookFile = files.find(file => file.includes(slug) && file.endsWith('.md'));

  if (!bookFile) {
    throw new Error(`Book not found with slug: ${slug}`);
  }

  const filepath = join(BOOKS_DIR, bookFile);

  // Read existing file
  const fileContent = await fs.readFile(filepath, 'utf-8');
  const { data: existingData, content: existingContent } = matter(fileContent);

  // Merge updates with existing data
  const updatedData: BookFormData = {
    ...existingData as BookFormData,
    ...updates,
  };

  // Use updated content if provided, otherwise keep existing
  const content = updates.content !== undefined ? updates.content : existingContent;

  // Generate new markdown
  const frontmatter = generateFrontmatter(updatedData);
  const markdown = `---\n${frontmatter}---\n\n${content}`;

  // Write to temporary file first, then rename (atomic operation)
  const tmpFilepath = filepath + '.tmp';
  await fs.writeFile(tmpFilepath, markdown, 'utf-8');
  await fs.rename(tmpFilepath, filepath);
}

export async function deleteBookMarkdown(slug: string): Promise<void> {
  // Find the book file by slug
  const files = await fs.readdir(BOOKS_DIR);
  const bookFile = files.find(file => file.includes(slug) && file.endsWith('.md'));

  if (!bookFile) {
    throw new Error(`Book not found with slug: ${slug}`);
  }

  const filepath = join(BOOKS_DIR, bookFile);
  await fs.unlink(filepath);
}

export async function getBookFilenameBySlug(slug: string): Promise<string | null> {
  const files = await fs.readdir(BOOKS_DIR);
  const bookFile = files.find(file => file.includes(slug) && file.endsWith('.md'));
  return bookFile || null;
}
