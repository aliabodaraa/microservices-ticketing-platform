"use client";

import Link from "next/link";
import { CardCompact } from "@/components/card-compact";
import { SignInForm } from "@/features/auth/components/sign-in-form";
import { passwordForgotPath, signInMlPath, signUpPath } from "@/paths";
import { Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

const SignIn = () => {
  const lang = usePathname().startsWith("/ar") ? "ar" : "en";

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <CardCompact
        title="Sign In"
        description="Sign in to your account"
        className="w-full max-w-[420px] animate-fade-from-top"
        content={<SignInForm />}
        footer={
          <div className="flex flex-col gap-y-2">
            <Link
              className="text-sm text-muted-foreground"
              href={signUpPath(lang)}
            >
              No account yet?
            </Link>

            <Link
              className="text-sm text-muted-foreground"
              href={passwordForgotPath(lang)}
            >
              Forgot Password?
            </Link>
            <Link
              href={signInMlPath(lang)}
              className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
            >
              <Sparkles className="mr-1 h-3 w-3" />
              Sign in with Magic Link
            </Link>
          </div>
        }
      />
    </div>
  );
};

export default SignIn;
