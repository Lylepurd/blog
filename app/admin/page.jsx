"use client";
import { useState } from "react";
import dynamic from "next/dynamic"; // To load react-quill dynamically

// Load react-quill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css"; // Import the styles

export default function Admin() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const post = {
      title,
      content,
      date: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/create-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to create post: ${errorData.error || response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Post created successfully:", data.post);
      setMessage("Post created successfully!");
      setTitle("");
      setContent("");
      setError(""); // Clear error message
    } catch (error) {
      console.error("Error details:", error);
      setError(error.message);
      setMessage(""); // Clear success message
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 border border-gray-300 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Create a New Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          className="border border-gray-300 rounded-md p-2"
          required
        />
        <ReactQuill
          value={content}
          onChange={setContent}
          placeholder="Post content"
          className="border border-gray-300 rounded-md bg-white min-h-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600"
        >
          Add Post
        </button>
      </form>
      {message && <p className="text-green-500 mt-4">{message}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
