"use server";

import { buildClient } from "@/api/build-client";
import { headers } from "next/headers";
import { cache } from "react";
import { User } from "../model.type";

export const getAuth = cache(async () => {
  const headersList = await headers(); //relace it with cookie()
  const client = buildClient({
    Cookie: headersList.get("cookie") || "",
    Authorization: headersList.get("authorization") || "",
  });
  const user = (await client.get("/api/users/currentuser")).data.currentUser;
  console.log("useruser", user);
  if (!user) {
    return null;
  }

  return user as User;
});
