import * as z from "zod";
import { Models } from "appwrite";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { PostValidation } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { FileUploader, Loader } from "@/components/shared";
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queries";
import { useEffect } from "react";

// Extend the PostValidation schema to include location and tags
const ExtendedPostValidation = PostValidation.extend({
  location: z.string().optional(),
  tags: z.string().optional(),
});

type PostFormProps = {
  post?: Models.Document;
  action: "Crear" | "Actualización";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUserContext();
  const form = useForm<z.infer<typeof ExtendedPostValidation>>({
    resolver: zodResolver(ExtendedPostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      description: post ? post.description : "",
      file: [],
      location: post ? post.location : "",
      tags: post ? post.tags.join(",") : "",
    },
  });

  // Query
  const { mutateAsync: createPost, isLoading: isLoadingCreate } = useCreatePost();
  const { mutateAsync: updatePost, isLoading: isLoadingUpdate } = useUpdatePost();

  // Obtener ubicación del usuario y convertirla a nombre de ubicación
  useEffect(() => {
    if (!post) {
      getUserLocation()
        .then(async (location) => {
          const address = await getAddressFromCoordinates(location.lat, location.lon);
          form.setValue("location", address);
        })
        .catch((error) => {
          toast({
            title: "No se pudo obtener la ubicación",
            description: error.message,
          });
        });
    }
  }, [post, form, toast]);

  const getUserLocation = () => {
    return new Promise<{ lat: number; lon: number }>((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            resolve({ lat, lon });
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject(new Error("La geolocalización no es compatible con este navegador."));
      }
    });
  };

  const getAddressFromCoordinates = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();

      // Verificar si city y state existen en la respuesta
      const city = data.address.city || data.address.town || data.address.village || "Desconocido";
      const state = data.address.state || "Desconocido";

      return `${city}, ${state}`;
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Ubicación desconocida";
    }
  };

  // Handler
  const handleSubmit = async (value: z.infer<typeof ExtendedPostValidation>) => {
    // ACTION = UPDATE
    if (post && action === "Actualización") {
      const updatedPost = await updatePost({
        ...value,
        postId: post.$id,
        imageId: post.imageId,
        imageUrl: post.imageUrl,
      });

      if (!updatedPost) {
        toast({
          title: `${action} de la publicación fallida. Por favor, inténtelo de nuevo.`,
        });
      }
      return navigate(`/posts/${post.$id}`);
    }

    // ACTION = CREATE
    const newPost = await createPost({
      ...value,
      userId: user.id,
    });

    if (!newPost) {
      toast({
        title: `${action} de la publicación fallida. Por favor, inténtelo de nuevo.`,
      });
    }
    navigate("/");
  };

  return (
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
                  fieldChange={field.onChange}
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
                  placeholder="HablemosVerde, EcoSoluciones, Reciclaje, Noticias"
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
            disabled={isLoadingCreate || isLoadingUpdate}>
            {(isLoadingCreate || isLoadingUpdate) && <Loader />}
            {action} Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
