/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const activeLang = cookieStore.get("lang")?.value || "pt";

  try {
    const res = await axiosInstance({
      url,
      ...options,
      headers: {
        ...(options?.headers || {}),
        "Accept-Language": activeLang,
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


/**
 *  using fetch
 */

// CREATE HEADERS
async function createHeaders(
  headers?: HeadersInit
) {

  const cookieStore = await cookies();

  const cookieStr = cookieStore.toString();

  const accessToken =
    cookieStore.get("accessToken")?.value || "";

  return {
    ...headers,

    Authorization: accessToken
      ? `Bearer ${accessToken}`
      : "",

    ...(cookieStr && {
      cookie: cookieStr,
    }),
  };
}

// MAIN FETCH HELPER
async function serverFetchHelper(
  endPoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const { headers, ...rest } = options;

  // FIRST REQUEST
  const response = await fetch(
    `${backendUrl}${endPoint}`,
    {
      credentials: "include",
      headers: await createHeaders(headers),
      ...rest,
    }
  );


  if (response.status === 401) {
    console.log("Unauthorized! Redirecting to login...");
    redirect("/login?clearSession=true");
  }

  return response;
}


export const serverFetch = {
  get: (endPoint: string, options: RequestInit = {}) =>
    serverFetchHelper(endPoint, { method: "GET", ...options }),

  post: (endPoint: string, options: RequestInit = {}) =>
    serverFetchHelper(endPoint, { method: "POST", ...options }),

  put: (endPoint: string, options: RequestInit = {}) =>
    serverFetchHelper(endPoint, { method: "PUT", ...options }),

  patch: (endPoint: string, options: RequestInit = {}) =>
    serverFetchHelper(endPoint, { method: "PATCH", ...options }),

  delete: (endPoint: string, options: RequestInit = {}) =>
    serverFetchHelper(endPoint, { method: "DELETE", ...options }),
};