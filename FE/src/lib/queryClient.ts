import { useAuthStore } from "@/store/auth-store";
import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {  
  if (res.ok != true) {
    const text = (await res.text()) || res.statusText;
    const error = JSON.parse(text);    
    throw new Error(error.message);
  }
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  options: RequestInit = {}
) {
  const state = useAuthStore.getState();
  const response = await fetch(`${apiBaseUrl}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${state.accessToken}`,
      "Content-Type": "application/json",
    },
    method,
    credentials: "include",
    body: data ? JSON.stringify(data) : undefined,
  });

  await throwIfResNotOk(response); // Check for errors
  return response.json(); // Automatically return parsed JSON
}

type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = `${apiBaseUrl}${queryKey[0] as string}`;
    const state = useAuthStore.getState();
    const res = await fetch(url, {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${state.accessToken}`,
      },
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false
    },
    mutations: {
      retry: false,
    },
  },
});
