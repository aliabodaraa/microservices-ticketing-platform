"use client";

import { useActionState } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import {
  ActionState,
  EMPTY_ACTION_STATE,
} from "@/components/form/utils/to-action-state";
import { Input } from "@/components/ui/input";
import { signIn } from "../actions/sign-in";
import { _2faPath } from "@/paths";
import { usePathname, useRouter } from "next/navigation";

const SignInForm = () => {
  const router = useRouter();
  const lang = usePathname().startsWith("/ar") ? "ar" : "en";
  const [actionState, action] = useActionState(
    signIn.bind(null, lang),
    EMPTY_ACTION_STATE
  );
  const handleSuccess = (actionState: ActionState<any>) => {
    if (actionState.data.requires2FA) {
      localStorage.setItem("tempToken", actionState.data.tempToken);
      router.push(_2faPath(lang));
    }
  };
  return (
    <Form action={action} actionState={actionState} onSuccess={handleSuccess}>
      <Input
        name="email"
        placeholder="Email"
        defaultValue={actionState.payload?.get("email") as string}
      />
      <FieldError actionState={actionState} name="email" />
      <Input
        type="password"
        name="password"
        placeholder="Password"
        defaultValue={actionState.payload?.get("password") as string}
      />
      <FieldError actionState={actionState} name="password" />

      <SubmitButton label="Sign In" />
    </Form>
  );
};

export { SignInForm };
