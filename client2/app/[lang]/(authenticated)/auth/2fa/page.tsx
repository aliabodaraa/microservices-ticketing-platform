"use client";

import Link from "next/link";
import { CardCompact } from "@/components/card-compact";
import { signInMlPath } from "@/paths";
import { SignIn2FAForm } from "@/features/auth/components/sign-in-2fa-form";
import { usePathname } from "next/navigation";

const TwoFactorPage = () => {
  const lang = usePathname().startsWith("/ar") ? "ar" : "en";

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <CardCompact
        title="Sign In"
        description="Sign in to your account"
        className="w-full max-w-[420px] animate-fade-from-top"
        content={<SignIn2FAForm />}
        footer={
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Can not access your authenticator app?
            </p>

            <Link
              className="text-sm text-muted-foreground hover:text-blue-800"
              href={signInMlPath(lang)}
            >
              Try another sign in method
            </Link>
          </div>
        }
      />
    </div>
  );
};

export default TwoFactorPage;
