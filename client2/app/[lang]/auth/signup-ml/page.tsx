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
import {
  Mail,
  Loader2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import useRequest from "@/hooks/use-request";

const SignUpML = () => {
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const { refreshUser } = useAuth();

  const { doRequest, errors } = useRequest({
    url: "/api/users/signup-with-magic-links",
    method: "post",
    body: {
      email,
    },
    onSuccess: async () => {
      await refreshUser();
      setIsSubmitted(true);
      // Optional: Auto-redirect after success
      setTimeout(() => {
        router.push("/auth/email-sent");
      }, 2000);
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

  // Email validation
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Magic Link Sent!
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              We have sent a magic link to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Check your email and click the link to sign in to your account.
            </p>
            <Button
              variant="outline"
              onClick={() => setIsSubmitted(false)}
              className="w-full"
            >
              Send Another Link
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Sparkles className="h-8 w-8 text-purple-600" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Sign Up with Magic Link
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your email and we will send you a secure magic link
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
              {email && !isValidEmail(email) && (
                <p className="text-sm text-red-600">
                  Please enter a valid email address
                </p>
              )}
            </div>

            {/* Errors */}
            {errors && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                {errors}
              </div>
            )}

            {/* Verify Button */}
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              size="lg"
              disabled={loader || !isValidEmail(email)}
            >
              {loader ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Magic Link...
                </>
              ) : (
                <>
                  Send Magic Link
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            {/* Sign In Link */}
            <div className="text-center text-sm pt-4 border-t">
              <span className="text-muted-foreground">
                Already have an account?
                <Link
                  href="/auth/signin-ml"
                  className="text-purple-600 hover:text-purple-800 font-medium"
                >
                  Sign in with Magic Link
                </Link>
              </span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpML;
