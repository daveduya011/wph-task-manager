import { cookies } from "next/headers";

export async function fetchApi(input: RequestInfo, init?: RequestInit) {
  const cookieStore = cookies();

  return fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      Cookie: cookieStore.toString()
    },
    cache: "no-store",
  });
}
