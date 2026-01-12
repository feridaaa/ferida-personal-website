import { promises as fs } from 'fs';
import { join } from 'path';
import bcrypt from 'bcryptjs';
import type { User } from './types';

const USERS_FILE = join(process.cwd(), 'src', 'lib', 'users.json');

interface UsersData {
  users: User[];
}

async function readUsers(): Promise<UsersData> {
  try {
    const fileContent = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    // If file doesn't exist, return empty users array
    return { users: [] };
  }
}

async function writeUsers(data: UsersData): Promise<void> {
  await fs.writeFile(USERS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const data = await readUsers();
  const user = data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  return user || null;
}

export async function getUserById(id: string): Promise<User | null> {
  const data = await readUsers();
  const user = data.users.find(u => u.id === id);
  return user || null;
}

export async function createUser(userData: {
  name: string;
  email: string;
  password?: string;
  image?: string;
  role?: 'admin' | 'user';
}): Promise<User> {
  const data = await readUsers();

  // Check if user already exists
  const existingUser = data.users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Generate unique ID
  const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);

  // Hash password if provided
  let hashedPassword: string | undefined;
  if (userData.password) {
    hashedPassword = await hashPassword(userData.password);
  }

  const newUser: User = {
    id,
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    image: userData.image,
    role: userData.role || 'user',
    createdAt: new Date().toISOString(),
  };

  data.users.push(newUser);
  await writeUsers(data);

  return newUser;
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  const data = await readUsers();
  const userIndex = data.users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    throw new Error('User not found');
  }

  // Merge updates with existing user
  data.users[userIndex] = {
    ...data.users[userIndex],
    ...updates,
    id, // Ensure ID doesn't change
  };

  await writeUsers(data);
  return data.users[userIndex];
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function getAllUsers(): Promise<User[]> {
  const data = await readUsers();
  return data.users;
}
