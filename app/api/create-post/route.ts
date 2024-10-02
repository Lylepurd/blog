import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { title, content, date } = await req.json();

    if (!title || !content || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        date: new Date(date),
      },
    });

    return NextResponse.json({ message: 'Post created successfully!', post: newPost }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'An error occurred while creating the post' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}