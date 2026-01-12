import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/users';
import { RegisterFormSchema } from '@/lib/validation';
import { handleApiError } from '@/lib/errors';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = RegisterFormSchema.parse(body);

    // Check if user already exists
    const existingUser = await getUserByEmail(validatedData.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create user (password will be hashed in createUser function)
    const user = await createUser({
      name: validatedData.name,
      email: validatedData.email,
      password: validatedData.password,
      role: 'user', // Default role
    });

    // Return success (without password)
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return handleApiError(error);
  }
}
