import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "../api/client";
import { 
  LoginResponseSchema,
  ErrorResponseSchema,
  AuthUserSchema,
} from "../schemas/auth";
import { z } from "zod";
import { authDAL } from "../middleware/auth.dal";

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  user: z.infer<typeof AuthUserSchema> | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<string>;
  logout: () => void;
  clearError: () => void;
  verifyAuth: () => Promise<boolean>;
  setUser: (user: z.infer<typeof AuthUserSchema> | null) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isLoading: false,
      error: null,
      user: null,
      token: null,

      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });
          // USUARIO DE PRUEBA LOCAL
          if (email === "admin@admin.com" && password === "123456789") {
            set({
              isAuthenticated: true,
              token: "fake-token-for-testing",
              user: {
                _id: "1", // Añadido el campo id requerido
                name: "Victor Hernandez",
                email: "admin@admin.com",
                image: 'https://res.cloudinary.com/dwad8nrdl/image/upload/w_200,h_200,c_fill,g_face,r_max/v1745015913/user_avatars/ugqemdayqg9ykuxxqras.jpg'
              },
              isLoading: false
            });
            return;
          }

          const response = await apiClient.post("/auth/login", { email, password });
          const data = LoginResponseSchema.parse(response.data);

          set({
            isAuthenticated: true,
            token: data.token,
            isLoading: false,
          });

          await get().verifyAuth();
        } catch (error) {
          const message = error instanceof z.ZodError 
            ? "Invalid server response"
            : error instanceof Error 
              ? error.message 
              : "Unknown error";
              
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      register: async (name, email, password) => {
        try {
          set({ isLoading: true, error: null });

          const response = await apiClient.post("/auth/register", { name, email, password });
          const data = ErrorResponseSchema.parse(response.data);

          set({ error: null, isLoading: false });
          return data.msg;
        } catch (error) {
          const message = error instanceof z.ZodError 
            ? "Invalid server response"
            : error instanceof Error 
              ? error.message 
              : "Unknown error";
              
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      verifyAuth: async () => {
        const { token } = get();
        if (!token) return false;
        
        if (token === "fake-token-for-testing") {
          return true;
        }

        try {
          set({ isLoading: true });
          const user = await authDAL.verifyToken(token);
          set({ 
            isAuthenticated: true, 
            user,
            token, 
            isLoading: false 
          });
          return true;
        } catch (error) {
          console.error('Token verification failed:', error);
          get().logout();
          return false;
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          error: null,
        });
      },
      setUser: (user) => set({ user }),

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ 
        token: state.token,
        user: state.user
      }),
    }
  )
);