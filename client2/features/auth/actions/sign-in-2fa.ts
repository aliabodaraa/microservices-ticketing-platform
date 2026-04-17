"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import {
  ActionState,
  fromErrorToActionState,
} from "@/components/form/utils/to-action-state";
import { _2faPath, homePath } from "@/paths";
import { buildClient } from "@/api/build-client";
import { extractAuthCookieFromHeader, setCookieByKey } from "@/actions/cookies";
import { Locale } from "@/i18n.config";

const signInSchema = z.object({
  code: z.string().length(6, { message: "Code must be 6 digits" }),
});

export const signIn2FA = async (
  tempToken: string,
  _actionState: ActionState,
  formData: FormData,
  params: Promise<{ lang: Locale }>
) => {
  const lang = (await params).lang;

  try {
    const { code } = signInSchema.parse(Object.fromEntries(formData));
    const { headers, status }: any = await buildClient().post(
      "/api/users/2fa/login",
      {
        token: code,
        tempToken,
      }
    );
    if (status == 200) {
      const [key, value] = await extractAuthCookieFromHeader(headers);
      await setCookieByKey(key, value);
    } else {
      return fromErrorToActionState("ERROR");
    }
  } catch (error) {
    console.log("errrrrrr", error);
    return fromErrorToActionState(error);
  }

  redirect(homePath(lang));
};
