"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, LogIn, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import useRequest from "@/hooks/use-request";

const SignInMl = () => {
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const { refreshUser } = useAuth();

  const { doRequest, errors } = useRequest({
    url: "/api/users/signin-with-magic-links",
    method: "post",
    body: {
      email,
    },
    onSuccess: async () => {
      await refreshUser();
      router.push("/auth/email-sent");
    },
  });

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoader(true);
    try {
      await doRequest();
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Sparkles className="h-8 w-8 text-purple-600" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Sign In with Magic Link
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your email and we will send you a secure magic link to access
            your account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 pr-4 py-2"
                  required
                  disabled={loader}
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Errors */}
            {errors && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                {errors}
              </div>
            )}

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              size="lg"
              disabled={loader}
            >
              {loader ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Magic Link...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Send Magic Link
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            {/* Verification Link */}
            <div className="text-center text-sm pt-4 border-t">
              <span className="text-muted-foreground">
                Need to verify your email?
                <Link
                  href="/auth/signup-ml"
                  className="text-purple-600 hover:text-purple-800 font-medium"
                >
                  Verify now
                </Link>
              </span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInMl;
