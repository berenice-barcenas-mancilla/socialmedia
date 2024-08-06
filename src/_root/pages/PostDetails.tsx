import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import { Loader } from "@/components/shared";
import Swal from 'sweetalert2';
import { GridPostList, PostStats } from "@/components/shared";
import {
  useGetPostById,
  useGetUserPosts,
  useDeletePost,
} from "@/lib/react-query/queries";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUserContext();

  const { data: post, isLoading } = useGetPostById(id);
  const { data: userPosts, isLoading: isUserPostLoading } = useGetUserPosts(
    post?.creator.$id
  );
  const { mutate: deletePost } = useDeletePost();

  const relatedPosts = userPosts?.documents.filter(
    (userPost) => userPost.$id !== id
  );

  const handleDeletePost = () => {
    if (!id) {
      // Handle the case when `id` is not available
      console.error("Post ID is not available");
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres eliminar esta publicación?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        deletePost({ postId: id });
        Swal.fire(
          '¡Eliminado!',
          'La publicación ha sido eliminada.',
          'success'
        ).then(() => {
          navigate(-1);
        });
      }
    });
  };

  // Check if the current user is the owner of the post
  const isOwner = user.id === post?.creator.$id;

  return (
    <div className="post_details-container">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost">
          <img
            src="/assets/icons/back.svg"
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium hover:text-green-900">Atrás</p>
        </Button>
      </div>

      {isLoading || !post ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          {post?.imageUrl ? (
            <img
              src={post?.imageUrl}
              alt="post"
              className="post_details-img"
            />
          ) : null} {/* No mostrar leyenda si no hay imagen */}

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${post?.creator.$id}`}
                className="flex items-center gap-3">
                <img
                  src={
                    post?.creator.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                />
                <div className="flex gap-1 flex-col">
                  <p className="text-dark-2 font-semibold text-base">
                    {post?.creator.name}
                  </p>
                  <div className="flex-center gap-2 text-dark-3">
                    <p className="subtle-semibold lg:small-regular">
                      {multiFormatDateString(post?.$createdAt)}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link
                  to={`/update-post/${post?.$id}`}
                  className={`${!isOwner && "hidden"}`}>
                  <img
                    src="/assets/icons/edit.svg"
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>

                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`post_details-delete_btn hover:bg-red-500 ${!isOwner && "hidden"
                    }`}
                >
                  <img
                    src="/assets/icons/delete.svg"
                    alt="delete"
                    width={24}
                    height={24}
                  />
                </Button>
              </div>
            </div>

            <hr className="border w-full border-stone-100" />

            <div className="flex flex-col flex-1 w-full text-lg font-semibold text-dark-3">
              <p className="text-dark-1 font-bold text-lg">{post?.caption}</p>
              <p className="mt-2 text-emerald-950 text-sm">{post.description}</p>
              <ul className="flex gap-1 mt-2 text-xs">
                {post?.tags.map((tag: string, index: number) => (
                  <li
                    key={`${tag}${index}`}
                    className="text-emerald-900 small-regular">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full text-dark-1">
              <PostStats post={post} userId={user.id} />
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl">
        <hr className="border w-full border-emerald-700" />

        <h3 className="body-bold md:h3-bold w-full my-10">
          Más publicaciones relacionadas
        </h3>
        {isUserPostLoading || !relatedPosts ? (
          <Loader />
        ) : (
          <GridPostList posts={relatedPosts} />
        )}
      </div>
    </div>
  );
};

export default PostDetails;
