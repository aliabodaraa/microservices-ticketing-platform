"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import axios, { AxiosResponse } from "axios";

const createUserSchema = z.object({
  email: z.string().min(3),
  password: z.string().min(10),
});

interface UserState {
  errors: {
    email?: string;
    password?: string;
    _form?: string[];
  };
}

export async function signIn(
  {
    email,
    password,
  }: {
    email?: string;
    password?: string;
  },
  formState: UserState,
  formData: FormData
): Promise<UserState> {
  const result = createUserSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    return {
      errors: { ...result.error._zod.output },
    };
  }

  // const session = await auth();
  // if (!session || !session.user || !session.user.id) {
  //   return {
  //     errors: {
  //       _form: ["You must be signed in to do this"],
  //     },
  //   };
  // }

  const response: AxiosResponse = await axios({
    method: "post",
    url: "/api/users/signin",
    data: { email, password },
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.data?.requires2FA) {
    localStorage.setItem("tempToken", response.data.tempToken);
    redirect("/auth/2fa");
  } else {
    return {
      errors: {
        _form: ["Cannot find User"],
      },
    };
  }

  revalidatePath("/");
  redirect("/");
}
