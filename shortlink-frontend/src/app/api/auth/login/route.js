import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123'; // In production, define this in .env

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email/Username and password are required' }), { status: 400 });
    }

    // Accept both email or username (for admin)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { name: email }
        ]
      }
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }

    if (!user.isActive) {
      return new Response(JSON.stringify({ error: 'Account is inactive' }), { status: 403 });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return new Response(JSON.stringify({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } }), { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
