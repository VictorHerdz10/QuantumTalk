import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { apiClient } from "../api/client";
import { UserSchema } from "../schemas/user";
import { z } from "zod";
import { useAuthStore } from "./authStore";

type User = z.infer<typeof UserSchema>;

interface ProfileState {
  user: User | null;
  isLoading: boolean;
  isEditing: boolean;
  tempImage: string | null;
  fetchUser: (userData: Partial<User>) => void;
  setEditing: (isEditing: boolean) => void;
  updateUserProfile: (userData: Partial<User>) => Promise<User>;
  uploadImage: (file: File) => Promise<User>; // Cambiado para devolver User
  resetTempImage: () => void;
}

export const useProfileStore = create<ProfileState>()(
  immer((set, get) => ({
    user: null,
    isLoading: false,
    isEditing: false,
    tempImage: null,

    fetchUser: (userData: Partial<User>) => {
      set({ user: UserSchema.parse(userData) });
    },

    setEditing: (isEditing: boolean) => {
      set({ isEditing });
    },

    updateUserProfile: async (userData: Partial<User>) => {
      try {
        set({ isLoading: true });

        // Forzar la actualización con los datos recibidos
        const payload = {
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          info: userData.info,
        };

        const response = await apiClient.put("/user/profile", payload);
        const updatedUser = UserSchema.parse(
          response.data.userData || response.data
        );

        // Actualizar stores sin afectar el estado local
        set({ user: updatedUser });
        useAuthStore.getState().setUser(updatedUser);

        return updatedUser;
      } catch (error) {
        console.error("Update error:", error);
        throw error;
      } finally {
        set({ isLoading: false, isEditing: false });
      }
    },
    uploadImage: async (file: File) => {
      try {
        set({ isLoading: true, tempImage: null });

        const formData = new FormData();
        formData.append("file", file); // Cambiar de 'image' a 'file'

        // Validar tipo y tamaño antes de enviar
        const validTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/jpg",
        ];
        if (!validTypes.includes(file.type)) {
          throw new Error("Tipo de archivo no soportado. Use JPEG, PNG o GIF");
        }

        if (file.size > 10 * 1024 * 1024) {
          throw new Error("La imagen no puede ser mayor a 10MB");
        }

        // Mostrar preview
        const reader = new FileReader();
        reader.onload = (e) => set({ tempImage: e.target?.result as string });
        reader.readAsDataURL(file);

        const uploadResponse = await apiClient.post("/media/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${useAuthStore.getState().token}`,
          },
        });

        if (!uploadResponse.data?.url) {
          throw new Error("El servidor no devolvió la URL de la imagen");
        }

        const imageUrl = z.string().parse(uploadResponse.data.url);
        const updatedUser = await get().updateUserProfile({ image: imageUrl });

        set({ tempImage: null });
        return updatedUser;
      } catch (err) {
        // Manejo seguro de errores
        let errorMessage = "Error al subir la imagen";

        if (typeof err === "object" && err !== null) {
          // Error estándar de TypeScript/JavaScript
          if ("message" in err) {
            errorMessage = err.message as string;
          }
          // Error personalizado del backend (ajusta según tu API)
          if (
            "response" in err &&
            typeof err.response === "object" &&
            err.response !== null
          ) {
            if (
              "data" in err.response &&
              typeof err.response.data === "object" &&
              err.response.data !== null
            ) {
              if ("msg" in err.response.data) {
                errorMessage = err.response.data.msg as string;
              }
            }
          }
        }
        set({ tempImage: null });
        console.error("Error al subir la imagen:", err);
        throw new Error(errorMessage);
      } finally {
        set({ isLoading: false });
      }
    },

    resetTempImage: () => {
      set({ tempImage: null });
    },
  }))
);
