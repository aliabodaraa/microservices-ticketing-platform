"use client";

import Link from "next/link";
import { CardCompact } from "@/components/card-compact";
import { SignUpForm } from "@/features/auth/components/sign-up-form";
import SocialLoginButtons from "@/components/SocialLoginButtons";
import { signInMlPath, signInPath } from "@/paths";
import { usePathname } from "next/navigation";

const SignUp = () => {
  const lang = usePathname().startsWith("/ar") ? "ar" : "en";

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <CardCompact
        title="Sign In"
        description="Sign in to your account"
        className="w-full max-w-[420px] animate-fade-from-top"
        content={<SignUpForm />}
        footer={
          <div className="flex flex-col gap-y-4 w-full">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-muted-foreground">
                Prefer email verification?
                <Link
                  href={signInMlPath(lang)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Use Magic Links
                </Link>
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  or continue with
                </span>
              </div>
            </div>

            <SocialLoginButtons />

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?
                <Link
                  href={signInPath(lang)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Sign in now
                </Link>
              </span>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default SignUp;
