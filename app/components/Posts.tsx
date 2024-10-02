import ListItem from "./ListItem";
import { getSortedPostsData } from "@/lib/db"; // Import Prisma logic

type Post = {
  id: string;
  title: string;
  date: string;
};

type Props = {
  posts: Post[] | null; // Allow posts to be null in case of errors
};

export default function Posts({ posts }: Props) {
  return (
    <section className="mt-6 mx-auto max-w-2xl">
      <h2 className="text-4xl font-bold dark:text-white/90">Blog</h2>
      <ul className="w-full">
        {posts && posts.length > 0 ? (
          posts.map((post) => <ListItem key={post.id} post={post} />)
        ) : (
          <p className="text-center mt-4 text-white">No posts available</p>
        )}
      </ul>
    </section>
  );
}

// Fetch data at build time
export async function getStaticProps() {
  console.log("Fetching posts..."); // Log to confirm function execution
  try {
    const posts = await getSortedPostsData(); // Fetch posts using Prisma

    console.log("Posts fetched successfully:", posts); // Log the fetched posts

    return {
      props: {
        posts: posts || [], // Ensure posts is always an array
      },
    };
  } catch (error) {
    console.error("Error fetching posts:", error); // Log error details

    return {
      props: {
        posts: null, // Return null if fetching fails
      },
    };
  }
}
