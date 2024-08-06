import { Models } from "appwrite";
import { Loader, PostCard, UserCard } from "@/components/shared";
import { useGetRecentPosts, useGetUsers } from "@/lib/react-query/queries";

const Home = () => {
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

  if (isErrorPosts || isErrorCreators) {
    return (
      <div className="flex flex-col md:flex-row w-full">
        <div className="home-container flex-1">
          <p className="body-medium text-dark-1">Algo malo sucedió</p>
        </div>
        <div className="home-creators md:w-1/4 lg:w-1/5">
          <p className="body-medium text-dark-1">Algo malo sucedió</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row w-full">
      <div className="home-container flex-1">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">
            Hagamos eco de las soluciones ambientales
          </h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col gap-9 w-full">
              {posts?.documents.map((post: Models.Document) => (
                <li key={post.$id} className="flex justify-center w-full">
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="home-creators md:w-1/4 lg:w-1/5">
        <h3 className="h3-bold text-emerald-800">Mejores Creadores</h3>
        {isUserLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
            {creators?.documents.map((creator) => (
              <li key={creator?.$id}>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
