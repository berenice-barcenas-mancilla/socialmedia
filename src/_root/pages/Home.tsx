import { Models } from "appwrite";
import { Loader, PostCard, UserCard } from "@/components/shared";
import { useGetRecentPosts, useGetUsers } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: isAuthLoading, checkAuthUser } = useUserContext();

  const {
    data: posts,
    isLoading: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPosts();
  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers(10);

  useEffect(() => {
    const init = async () => {
      const isLoggedIn = await checkAuthUser();
      if (!isLoggedIn) {
        navigate("/sign-in");
      }
    };

    if (!isAuthenticated) {
      init();
    }
  }, [isAuthenticated, checkAuthUser, navigate]);

  if (isAuthLoading || isPostLoading || isUserLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return null; // O podrías mostrar un mensaje de "Redirigiendo..."
  }

  if (isErrorPosts || isErrorCreators) {
    return (
      <div className="flex flex-col lg:flex-row w-full gap-4">
        <div className="home-container flex-1">
          <p className="body-medium text-dark-1">Algo malo sucedió</p>
        </div>
        <div className="home-creators lg:w-80">
          <p className="body-medium text-dark-1">Algo malo sucedió</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row w-full gap-4">
      <div className="home-container flex-1">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full mb-6">
            Hagamos eco de las soluciones ambientales
          </h2>
          <ul className="flex flex-col gap-9 w-full">
            {posts?.documents.map((post: Models.Document) => (
              <li key={post.$id} className="w-full">
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="home-creators lg:w-80">
        <h3 className="h3-bold text-emerald-800 mb-6">Mejores Creadores</h3>
        <ul className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 gap-6">
          {creators?.documents.map((creator) => (
            <li key={creator?.$id}>
              <UserCard user={creator} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;