"use client";

import { useActionState, useState } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Input } from "@/components/ui/input";
import { signUp } from "../actions/sign-up";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock, VerifiedIcon } from "lucide-react";
import { usePathname } from "next/navigation";

const SignUpForm = () => {
  const lang = usePathname().startsWith("/ar") ? "ar" : "en";

  const [actionState, action] = useActionState(
    signUp.bind(null, lang),
    EMPTY_ACTION_STATE
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Form action={action} actionState={actionState}>
      <Input
        name="email"
        placeholder="Email"
        defaultValue={actionState.payload?.get("email") as string}
      />
      <FieldError actionState={actionState} name="email" />

      <div className="space-y-2  password-field">
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            className="pl-10 pr-10 py-2"
            required
          />
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        <FieldError actionState={actionState} name="password" />
      </div>
      <div className="space-y-2  confirm-password-field">
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            className="pl-10 pr-10 py-2"
            defaultValue={actionState.payload?.get("confirmPassword") as string}
          />
          <VerifiedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        <FieldError actionState={actionState} name="confirmPassword" />
      </div>

      <SubmitButton label="Sign Up" />
    </Form>
  );
};

export { SignUpForm };
