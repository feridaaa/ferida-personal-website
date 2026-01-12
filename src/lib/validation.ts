import { z } from 'zod';

// User authentication schemas
export const RegisterFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const LoginFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Book form schemas
export const BookFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  author: z.string().min(1, 'Author is required').max(200),
  slug: z.string()
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .min(1, 'Slug is required'),
  dateRead: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  datePublished: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  rating: z.number().min(0, 'Rating must be at least 0').max(5, 'Rating must be at most 5'),
  pages: z.number().int('Pages must be a whole number').min(0, 'Pages must be positive'),
  coverImage: z.string().min(1, 'Cover image is required'),
  tags: z.array(z.string()).min(1, 'At least one tag is required').max(10, 'Maximum 10 tags allowed'),
  genre: z.string().min(1, 'Genre is required').max(100),
  status: z.enum(['completed', 'currently-reading', 'want-to-read', 'dnf']),
  excerpt: z.string().max(500, 'Excerpt must be 500 characters or less'),
  content: z.string().optional(),
  isbn: z.string().optional(),
  goodreadsUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export const ReviewFormSchema = BookFormSchema.extend({
  content: z.string().min(100, 'Review must be at least 100 characters'),
  status: z.literal('completed'),
  rating: z.number().min(1, 'Rating is required for completed books').max(5),
});

export const WantToReadFormSchema = BookFormSchema.partial({
  dateRead: true,
  rating: true,
  content: true,
  excerpt: true,
}).extend({
  status: z.literal('want-to-read'),
  dateRead: z.string().optional(),
  rating: z.number().optional(),
  excerpt: z.string().optional(),
});

// Type exports for use in components
export type RegisterFormData = z.infer<typeof RegisterFormSchema>;
export type LoginFormData = z.infer<typeof LoginFormSchema>;
export type BookFormData = z.infer<typeof BookFormSchema>;
export type ReviewFormData = z.infer<typeof ReviewFormSchema>;
export type WantToReadFormData = z.infer<typeof WantToReadFormSchema>;
