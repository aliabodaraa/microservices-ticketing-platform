"use server";

import { redirect } from "next/navigation";
import { signInPath } from "@/paths";
import { getAuth } from "../queries/get-auth";
import { revalidatePath } from "next/cache";
import { deleteAuthCookie } from "@/actions/cookies";
import { Locale } from "@/i18n.config";

export const signOut = async (lang: Locale) => {
  const user = await getAuth();
  if (!user) {
    redirect(signInPath(lang));
  }

  try {
    await deleteAuthCookie();
  } catch (error) {
    console.log(error, "error");
  }

  revalidatePath(signInPath(lang));
  redirect(signInPath(lang));
};
