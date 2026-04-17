interface CurrentUser {
  id: string;
  email: string;
  // Add other user properties as needed
}
import { buildClient } from "@/api/build-client";
import { cookies, headers } from "next/headers";

export const useAuthServer = async () =>
  (
    await buildClient({
      Cookie: (await headers()).get("cookie") || "",
      Authorization: (await headers()).get("authorization") || "",
    }).get("/api/users/currentuser")
  ).data as {
    currentUser: CurrentUser | null;
  };
