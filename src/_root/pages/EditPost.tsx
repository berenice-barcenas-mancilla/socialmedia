import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { useGetPostById, useUpdatePost } from "@/lib/react-query/queries";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Input,
  Textarea,
} from "@/components/ui";
import { FileUploader, Loader } from "@/components/shared";
import { PostValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";

type IEditPostForm = {
  caption: string;
  description: string;
  file: File[];
  location?: string;
  tags?: string;
};

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: post, isLoading } = useGetPostById(id);
  const { mutateAsync: updatePost, isLoading: isLoadingUpdate } = useUpdatePost();
  const [file, setFile] = useState<File[]>([]);
  
  const form = useForm<IEditPostForm>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: "",
      description: "",
      file: [],
      location: "",
      tags: "",
    },
  });

  useEffect(() => {
    if (post) {
      form.reset({
        caption: post.caption,
        description: post.description,
        location: post.location,
        tags: post.tags.join(","),
      });
    }
  }, [post, form]);

  const handleSubmit = async (values: IEditPostForm) => {
    if (!post) {
      toast({
        title: "No se pudo encontrar la publicación. Por favor, inténtelo de nuevo.",
      });
      return;
    }

    const updatedPost = await updatePost({
      ...values,
      postId: post.$id,
      imageId: post.imageId,
      imageUrl: post.imageUrl,
      file: file.length > 0 ? file : [],
    });

    if (!updatedPost) {
      toast({
        title: "Actualización de la publicación fallida. Por favor, inténtelo de nuevo.",
      });
    } else {
      navigate(`/posts/${post.$id}`);
    }
  };

  if (isLoading)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <h2 className="h3-bold md:h2-bold text-left w-full">Editar Publicación</h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-9 w-full max-w-5xl">
            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Título</FormLabel>
                  <FormControl>
                    <Textarea
                      className="shad-textarea custom-scrollbar"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      className="shad-textarea custom-scrollbar"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Agregar Foto</FormLabel>
                  <FormControl>
                    <FileUploader
                      fieldChange={(files) => {
                        field.onChange(files);
                        setFile(files);
                      }}
                      mediaUrl={post?.imageUrl}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Agregar Ubicación</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">
                    Agregar etiquetas (separadas por coma " , ")
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Noticias, Reciclaje"
                      type="text"
                      className="shad-input text-stone-700"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <div className="flex gap-4 items-center justify-end">
              <Button
                type="button"
                className="bg-rose-600 hover:bg-rose-700 text-light-1"
                onClick={() => navigate(-1)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="shad-button_primary whitespace-nowrap"
                disabled={isLoadingUpdate}>
                {isLoadingUpdate && <Loader />}
                Actualizar Publicación
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditPost;
