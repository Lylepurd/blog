import { PrismaClient } from '@prisma/client';

// Extend the global interface to include PrismaClient
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a singleton instance of PrismaClient to prevent multiple connections
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

// Function to get all posts sorted by date
export async function getSortedPostsData() {
  const posts = await prisma.post.findMany({
    orderBy: {
      date: 'desc',
    },
  });

  return posts.map((post) => ({
    id: post.id.toString(),
    title: post.title,
    date: post.date instanceof Date ? post.date.toISOString().split('T')[0] : '',
  }));
}

// Function to get a single post by ID
export async function getPostData(id: string) {
  const postId = parseInt(id, 10);
  if (isNaN(postId)) {
    throw new Error('Invalid post ID');
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new Error('Post not found');
  }

  return {
    id: post.id.toString(),
    title: post.title,
    date: post.date instanceof Date ? post.date.toISOString().split('T')[0] : '',
    content: post.content,
  };
}
