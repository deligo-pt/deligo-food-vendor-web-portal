import { verifyTokens } from "@/src/utils/verifyTokens";
import axios, { AxiosRequestConfig } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const backendUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

const axiosInstance = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
});

const serverRequestHelper = async (
  url: string,
  options?: AxiosRequestConfig,
) => {
  const cookieStore = await cookies();

  const cookieStr = cookieStore.toString();
  const accessToken = cookieStore.get("accessToken")?.value || "";

  if (url !== "/auth/refresh-token") {
    await verifyTokens();
  }

  return (
    axiosInstance({
      url,
      ...options,
      headers: {
        ...(options?.headers || {}),
        ...(accessToken && {
          authorization: `Bearer ${accessToken}`,
        }),
        ...(cookieStr && {
          cookie: cookieStr,
        }),
      },
    })
      .then((res) => res.data)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((error: any) => {
        const status = error?.response?.status;

        if (status === 401) {
          cookieStore.delete("accessToken");
          cookieStore.delete("refreshToken");

          redirect("/login?sessionExpired=true");
        }

        throw error;
      })
  );
};

export const serverRequest = {
  get: (url: string, options: AxiosRequestConfig = {}) =>
    serverRequestHelper(url, { ...options, method: "GET" }),

  post: (url: string, options: AxiosRequestConfig = {}) =>
    serverRequestHelper(url, { ...options, method: "POST" }),

  patch: (url: string, options: AxiosRequestConfig = {}) =>
    serverRequestHelper(url, { ...options, method: "PATCH" }),

  delete: (url: string, options: AxiosRequestConfig = {}) =>
    serverRequestHelper(url, { ...options, method: "DELETE" }),
};
