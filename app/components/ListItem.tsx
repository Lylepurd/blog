import Link from "next/link";
import getFormattedDate from "@/lib/getFormattedDate";

type Post = {
  id: string;
  title: string;
  date: string;
};

type Props = {
  post: Post;
};

export default function ListItem({ post }: Props) {
  const { id, title, date } = post;
  const formattedDate = date ? getFormattedDate(date) : 'Unknown date';  // Handle empty date string

  return (
    <li className="mt-4 text-2xl dark:text-white/90">
      <Link className="underline hover:text-black/70 dark:hover:text-white" href={`/posts/${id}`}>
        {title}
      </Link>
      <br />
      <p className="text-sm mt-1">{formattedDate}</p>
    </li>
  );
}
