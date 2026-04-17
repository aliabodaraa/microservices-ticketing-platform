"use server";

import { redirect } from "next/navigation";
import { email, z } from "zod";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { _2faPath, homePath } from "@/paths";
import { buildClient } from "@/api/build-client";
import { extractAuthCookieFromHeader, setCookieByKey } from "@/actions/cookies";
import { Locale } from "@/i18n.config";

const signInSchema = z.object({
  email: email(),
  password: z.string().min(6).max(191),
});

export const signIn = async (
  lang: Locale,
  _actionState: ActionState,
  formData: FormData
) => {
  console.log("formData", lang, Object.fromEntries(formData));
  try {
    const { email, password } = signInSchema.parse(
      Object.fromEntries(formData)
    );
    const { headers, data, status }: any = await buildClient().post(
      "/api/users/signin",
      {
        email,
        password,
      }
    );
    console.log(data, "datadatadata");
    if (!data) {
      return toActionState("ERROR", "Incorrect email or password", formData);
    }

    if (status == 200 && data) {
      if (data.requires2FA) {
        //call callback onSuccess to save the token in local storage and redirect to 2FA page
        return toActionState("SUCCESS", "", undefined, {
          requires2FA: data.requires2FA,
          tempToken: data.tempToken,
        });
      } else {
        const [key, value] = await extractAuthCookieFromHeader(headers);
        await setCookieByKey(key, value);
      }
    } else {
      console.log("errorrrrrr");
      return fromErrorToActionState("ERROR");
    }
  } catch (error) {
    console.log("errrrrrr", error);
    return fromErrorToActionState(error);
  }
  await setCookieByKey("toast", "Logged In Successfully");
  redirect(homePath(lang));
};
