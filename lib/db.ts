import { PrismaClient } from '@prisma/client';

// Extend the global interface to include PrismaClient
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a singleton instance of PrismaClient to prevent multiple connections
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') {
  console.log("Initializing Prisma Client"); // Log initialization
  global.prisma = prisma;
}

// Function to get all posts sorted by date
export async function getSortedPostsData() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        date: 'desc',
      },
    });

    console.log("Fetched posts from the database:", posts); // Log fetched posts

    return posts.map((post) => ({
      id: post.id.toString(),
      title: post.title,
      date: post.date instanceof Date ? post.date.toISOString().split('T')[0] : 'Unknown date',
    }));
  } catch (error) {
    console.error("Error fetching posts:", error); // Log error details
    return []; // Return an empty array on error
  }
}

// Function to get a single post by id
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

  const formattedDate = post.date instanceof Date ? post.date.toISOString().split('T')[0] : '';

  return {
    id: post.id.toString(),
    title: post.title,
    date: formattedDate,  // Ensure date is always a string
    content: post.content,
  };
}
