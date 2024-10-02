import Posts from "./components/Posts"; // Import your Posts component
import { getSortedPostsData } from "@/lib/db"; // Import the function to fetch posts

// Define the Home component as an async function to fetch data directly
export default async function Home() {
  console.log("Fetching posts..."); // Log to confirm function execution

  let posts = [];
  try {
    posts = await getSortedPostsData(); // Fetch posts using Prisma
    console.log("Posts fetched successfully:", posts); // Log the fetched posts
  } catch (error) {
    console.error("Error fetching posts:", error); // Log error details
  }

  return (
    <main className="px-6 mx-auto">
      <p className="mt-12 mb-12 text-3xl text-center dark:text-white">
        Hello and Welcome 👋&nbsp;
        <span className="whitespace-nowrap">
          I&apos;m <span className="font-bold">Lyle</span>
        </span>
      </p>
      <Posts posts={posts} /> {/* Pass the posts as a prop to Posts */}
    </main>
  );
}
