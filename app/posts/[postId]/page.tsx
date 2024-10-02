import getFormattedDate from "@/lib/getFormattedDate";
import { getPostData } from "@/lib/posts"; // Ensure this path is correct
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";

// Import for HTML tag stripping
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

export default async function PostPage({ params }: { params: { postId: string } }) {
  const { postId } = params;

  let post;
  try {
    post = await getPostData(postId);
  } catch (error) {
    console.error("Error fetching post:", error);
    return notFound(); // Redirect to 404 if post not found
  }

  // Custom renderer for code blocks
  const renderers = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      return inline ? (
        <code className={`bg-gray-200 rounded p-1 ${className}`} {...props}>
          {children}
        </code>
      ) : (
        <SyntaxHighlighter
          style={solarizedlight}
          language={match ? match[1] : ""}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      );
    },
    h1: ({ children }) => <h1 className="text-3xl font-bold my-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-bold my-3">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-semibold my-2">{children}</h3>,
    p: ({ children }) => <p className="my-2">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-5 my-2">{children}</ul>,
    li: ({ children }) => <li className="my-1">{children}</li>,
  };

  return (
    <article className="flex flex-col w-full max-w-3xl mx-auto px-4 py-6 bg-gray-800 text-gray-200 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <time dateTime={post.date} className="block text-gray-400 mb-4">
        {getFormattedDate(post.date)}
      </time>
      <div className="prose prose-invert mb-4">
        <ReactMarkdown components={renderers} rehypePlugins={[rehypeRaw, rehypeSanitize]}>
          {post.content}
        </ReactMarkdown>
      </div>
      <Link href="/" className="text-blue-400 hover:underline">
        Back to Home
      </Link>
    </article>
  );
}
