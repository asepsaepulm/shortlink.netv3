import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: 'Name, email, and password are required' }), { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { name }
        ]
      }
    });

    if (existingUser) {
      return new Response(JSON.stringify({ error: 'Email or name already exists' }), { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'user'
      }
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return new Response(JSON.stringify({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } }), { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
