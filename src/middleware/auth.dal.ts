import { apiClient } from "../api/client";
import { AuthUserSchema, ErrorResponseSchema } from "../schemas/auth";
import { z } from "zod";

export const authDAL = {
  async verifyToken(
    token: string
  ): Promise<z.infer<typeof AuthUserSchema> | null> {
    try {
      const response = await apiClient.get("/user/authenticate", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Primero verifica si es un error
      if (response.data.msg) {
        const errorData = ErrorResponseSchema.parse(response.data);
        console.error("Authentication failed:", errorData.msg);
        return null;
      }

      // Si no es error, parsea como AuthUser
      const userData = AuthUserSchema.parse(response.data);
      return userData;
    } catch (error) {
      console.error("Token verification failed:", error);
      return null;
    }
  },
};