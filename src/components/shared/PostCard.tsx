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
    <div className="post-card w-full rounded-xl shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={post.creator?.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="creator"
              className="w-12 h-12 rounded-full object-cover"
            />
          </Link>

          <div className="flex flex-col">
            <p className="text-dark-2 font-semibold text-sm sm:text-base">
              {post.creator.name}
            </p>
            <div className="flex gap-2 text-dark-3 text-xs">
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

          <div className="text-dark-1">
            <p className="font-bold text-base sm:text-lg mb-2 line-clamp-2">
              {post.caption}
            </p>
            <p className="text-emerald-950 text-sm sm:text-base mb-2 line-clamp-3">
              {post.description}
            </p>
            <ul className="flex flex-wrap gap-1 mt-2 text-xs sm:text-sm">
              {post.tags.map((tag: string, index: number) => (
                <li key={`${tag}${index}`} className="text-emerald-900">
                  #{tag}
                </li>
              ))}
            </ul>
          </div>
        </Link>
      </div>

      <div className="p-4 ">
        <PostStats post={post} userId={user.id} />
      </div>
    </div>
  );
};
export default PostCard;