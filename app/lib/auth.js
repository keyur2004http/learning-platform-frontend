import { cookies } from "next/headers";
import { BACKEND_URL } from "./config";

export async function authenticatedFetch(url, options = {}) {
  const cookieStore = await cookies();

  let accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!accessToken && !refreshToken) {
    return {
      response: null,
      accessToken: null,
      refreshed: false,
      sessionExpired: true,
    };
  }

  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (response.status !== 401 || !refreshToken) {
    return {
      response,
      accessToken,
      refreshed: false,
      sessionExpired: false,
    };
  }

  const refreshResponse = await fetch(
    `${BACKEND_URL}/api/token/refresh/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
      cache: "no-store",
    }
  );

  if (!refreshResponse.ok) {
    return {
      response: null,
      accessToken: null,
      refreshed: false,
      sessionExpired: true,
    };
  }

  const refreshData = await refreshResponse.json();
  accessToken = refreshData.access;

  response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  return {
    response,
    accessToken,
    refreshed: true,
    sessionExpired: false,
  };
}
export function sessionExpiredResponse() {
  const response = NextResponse.json(
    {
      detail: "Your session has expired. Please log in again.",
      sessionExpired: true,
    },
    { status: 401 }
  );

  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");

  return response;
}