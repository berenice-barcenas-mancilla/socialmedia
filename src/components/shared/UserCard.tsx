import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";
import { 
  useFollowUser, 
  useUnfollowUser, 
  useGetUserFollowers 
} from "@/lib/react-query/queries";

type UserCardProps = {
  user: Models.Document;
};

const UserCard = ({ user }: UserCardProps) => {
  const { user: currentUser } = useUserContext();
  const { mutate: followUser } = useFollowUser();
  const { mutate: unfollowUser } = useUnfollowUser();
  const { data: followers, isLoading: isFollowersLoading } = useGetUserFollowers(user.$id);

  const [isFollowing, setIsFollowing] = useState(false);

  if (user.$id === currentUser.id) {
    return null;
  }

  useEffect(() => {
    if (followers) {
      setIsFollowing(followers.documents.some((follow: any) => follow.follower.$id === currentUser.id));
    }
  }, [followers, currentUser.id]);

  const handleFollowUser = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFollowing) {
      const followDocument = followers?.documents.find(
        (follow: any) => follow.follower.$id === currentUser.id
      );
      if (followDocument) unfollowUser(followDocument.$id);
    } else {
      followUser({ followerId: currentUser.id, followedId: user.$id });
    }
    setIsFollowing(!isFollowing);
  };

  if (isFollowersLoading) return null;

  return (
    <Link to={`/profile/${user.$id}`} className="user-card">
      <img
        src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-emerald-800 text-center line-clamp-1">
          {user.name}
        </p>
        <p className="small-regular text-stone-700 text-center line-clamp-1">
          @{user.username}
        </p>
      </div>

      <Button 
        type="button" 
        size="sm" 
        className="shad-button_primary px-5"
        onClick={handleFollowUser}
      >
        {isFollowing ? "Dejar de seguir" : "Seguir"}
      </Button>
    </Link>
  );
};

export default UserCard;