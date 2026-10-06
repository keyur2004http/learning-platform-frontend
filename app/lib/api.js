import { cookies } from "next/headers";
import { BACKEND_URL } from "../../../lib/config";
export async function apiFetch(url, options = {}) {
  const cookieStore = await cookies();

  let accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return null;
  }

  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (response.status !== 401) {
    return response;
  }

  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    return response;
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
    return response;
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

  return response;
}