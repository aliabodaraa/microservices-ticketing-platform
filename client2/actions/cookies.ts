"use server";

import { cookies } from "next/headers";

export const getCookieByKey = async (key: string) => {
  const cookie = (await cookies()).get(key);

  if (!cookie) {
    return null;
  }

  return cookie.value;
};

export const setCookieByKey = async (key: string, value: string) => {
  (await cookies()).set(key, value);
};

export const deleteCookieByKey = async (key: string) => {
  (await cookies()).delete(key);
};

export const extractAuthCookieFromHeader = async (partialHeader: {
  "set-cookie": string;
}): Promise<[string, string]> => {
  const [key, value] = partialHeader["set-cookie"][0].split("=");
  return [key, value.split(";")[0]];
};
export const deleteAuthCookie = async (): Promise<void> => {
  await setCookieByKey("express:sess", "");
};
