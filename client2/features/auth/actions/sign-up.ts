"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { _2faPath, homePath } from "@/paths";
import { buildClient } from "@/api/build-client";
import { extractAuthCookieFromHeader, setCookieByKey } from "@/actions/cookies";
import { Locale } from "@/i18n.config";

const signUpSchema = z
  .object({
    email: z.string().min(1, { message: "Is required" }).max(191).email(),
    password: z.string().min(6).max(191),
    confirmPassword: z.string().min(6).max(191),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export const signUp = async (
  lang: Locale,
  _actionState: ActionState,
  formData: FormData
) => {
  try {
    const { email, password } = signUpSchema.parse(
      Object.fromEntries(formData)
    );
    const { headers, data, status }: any = await buildClient().post(
      "/api/users/signup",
      {
        email,
        password,
      }
    );

    if (!data) {
      return toActionState("ERROR", "Incorrect email or password", formData);
    }

    if (status == 201 && data) {
      const [key, value] = await extractAuthCookieFromHeader(headers);
      await setCookieByKey(key, value);
    } else {
      return fromErrorToActionState("ERROR");
    }
  } catch (error: any) {
    return fromErrorToActionState(error.response?.data.errors ?? error);
  }
  redirect(homePath(lang));
};
