"use client";

import { useActionState, useEffect, useState } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import {
  ActionState,
  EMPTY_ACTION_STATE,
} from "@/components/form/utils/to-action-state";
import { Input } from "@/components/ui/input";
import { signIn2FA } from "../actions/sign-in-2fa";
import { _2faPath, signInPath } from "@/paths";
import { useRouter } from "next/navigation";
import { Key, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const SignIn2FAForm = () => {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [storedTempToken, setStoredTempToken] = useState<string>("");

  useEffect(() => {
    const tempToken = localStorage.getItem("tempToken");
    setStoredTempToken(tempToken || "");
  }, [router]);

  const [actionState, action] = useActionState(
    signIn2FA.bind(null, storedTempToken),
    EMPTY_ACTION_STATE
  );
  const handleSuccess = () => {
    localStorage.removeItem("tempToken");
  };
  return (
    <>
      <Form action={action} actionState={actionState} onSuccess={handleSuccess}>
        <div className="space-y-2">
          <Label htmlFor="code" className="text-sm font-medium">
            Verification Code
          </Label>
          <div className="relative">
            <Input
              name="code"
              type="text"
              placeholder="Enter 6-digit code"
              onChange={(e) => setToken(e.target.value)}
              defaultValue={actionState.payload?.get("code") as string}
            />
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Enter the 6-digit code from your authenticator app
          </p>
          <FieldError actionState={actionState} name="code" />
        </div>
        <SubmitButton
          label="Verify Code"
          icon={<Lock className="mr-2 h-4 w-4" />}
          disabled={token.length !== 6}
        />
      </Form>
    </>
  );
};

export { SignIn2FAForm };
