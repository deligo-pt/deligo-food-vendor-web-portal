/* eslint-disable @typescript-eslint/no-explicit-any */
import { verifyTokens } from "@/src/utils/verifyTokens";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const backendUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

const axiosInstance = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
});


export const serverRequestHelper = async (
  url: string,
  options?: AxiosRequestConfig,
) => {
  const cookieStore = await cookies();
  const cookieStr = cookieStore.toString();
  const accessToken = cookieStore.get("accessToken")?.value || "";

  if (url !== "/auth/refresh-token") {
    await verifyTokens();
  }

  try {
    const res = await axiosInstance({
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
    });

    return res.data;
  } catch (error: any) {

    if (isRedirectError(error)) {
      throw error;
    }

    const err = error as AxiosError;

    const respData = err.response?.data as any;

    if (respData?.err?.statusCode === 401 && respData?.message === 'You have been logged out from this device. Please log in again.') {
      console.log("Unauthorized! Redirecting to login...");

      redirect('/login?clearSession=true');
    }


    throw error;
  }
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
