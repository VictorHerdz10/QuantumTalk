import axios, { AxiosResponse, AxiosError } from "axios";
import { environment } from "../environments/environment";
import { useAuthStore } from "../store/authStore";
import { ErrorResponseSchema } from "../schemas/auth";

export const apiClient = axios.create({
  baseURL: `${environment.apiUrl}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

const NO_AUTH_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
];

apiClient.interceptors.request.use((config) => {
  const isPublicEndpoint = NO_AUTH_ENDPOINTS.some(endpoint => 
    config.url?.includes(endpoint)
  );

  if (isPublicEndpoint) {
    console.log('[HTTP] Skipping token for public endpoint:', config.url);
    return config;
  }

  const { token } = useAuthStore.getState();
  
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    useAuthStore.getState().logout();
  }
  
  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const errorData = error.response?.data;
    let parsedError: { msg: string };
    
    try {
      parsedError = ErrorResponseSchema.parse(errorData);
    } catch {
      parsedError = { msg: error.message || "Error desconocido" };
    }

    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(new Error(parsedError.msg));
  }
);