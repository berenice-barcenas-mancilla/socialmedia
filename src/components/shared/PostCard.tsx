import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { PostStats } from "@/components/shared";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";

type PostCardProps = {
  post: Models.Document;
};

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();

  if (!post.creator) return null;

  return (
    <div className="post-card max-w-full md:max-w-md mx-auto p-4 border border-stone-200 rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <Link to={`/profile/${post.creator.$id}`}>
          <img
            src={post.creator?.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="creator"
            className="w-12 h-12 rounded-full object-cover"
          />
        </Link>

        <div className="flex flex-col">
          <p className="text-dark-2 font-semibold text-base md:text-lg lg:text-xl break-words">
            {post.creator.name}
          </p>
          <div className="flex gap-2 text-dark-3 text-xs md:text-sm lg:text-base">
            <p className="subtle-semibold">
              {multiFormatDateString(post.$createdAt)}
            </p>
            •
            <p className="subtle-semibold">
              {post.location}
            </p>
          </div>
        </div>
      </div>

      <Link to={`/posts/${post.$id}`} className="block">
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt="post image"
            className="w-full h-auto rounded-lg mb-4 object-cover"
          />
        )}

        <div className="text-lg font-semibold text-dark-1 mb-2">
          <p className="font-bold text-base md:text-lg lg:text-xl break-words">
            {post.caption}
          </p>
          <p className="mt-2 text-emerald-950 text-sm md:text-base lg:text-lg break-words">
            {post.description}
          </p>
          <ul className="flex gap-1 mt-2 text-xs md:text-sm lg:text-base flex-wrap">
            {post.tags.map((tag: string, index: number) => (
              <li key={`${tag}${index}`} className="text-emerald-900">
                #{tag}
              </li>
            ))}
          </ul>
        </div>
      </Link>

      <PostStats post={post} userId={user.id} />
    </div>
  );
};

export default PostCard;
