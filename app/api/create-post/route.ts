import { NextResponse } from 'next/server';
import { Prisma, PrismaClient } from '@prisma/client';

// Create a singleton instance of PrismaClient
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { title, content, date } = await req.json();

    // Check for required fields
    if (!title || !content || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Ensure the date is valid
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    // Create a new post
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        date: parsedDate,
      },
    });

    return NextResponse.json({ message: 'Post created successfully!', post: newPost }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'An error occurred while creating the post' }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma Client after request is complete
  }
}

