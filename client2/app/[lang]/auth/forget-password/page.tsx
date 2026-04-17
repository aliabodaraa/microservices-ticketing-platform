"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Mail, Loader2, KeyRound, ArrowRight } from "lucide-react";
import useRequest from "@/hooks/use-request";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);
  const router = useRouter();

  const { doRequest, errors } = useRequest({
    url: "/api/users/forgot-password",
    method: "post",
    body: {
      email,
    },
    onSuccess: () => router.push("/auth/email-sent"),
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-orange-100 p-3">
              <KeyRound className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            Reset Your Password
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your email address and we will send you a password reset link
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={onSubmit} className="space-y-4">
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

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              size="lg"
              disabled={loader}
            >
              {loader ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Reset Link...
                </>
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Additional Information */}
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>📧 Check your inbox for the password reset link</p>
            <p>🔒 The link will expire in 1 hour for security</p>
            <p>🔄 You can request a new link if it expires</p>
          </div>

          {/* Back to Sign In */}
          <div className="text-center pt-4 border-t">
            <Button
              variant="link"
              className="text-orange-600 hover:text-orange-800"
              onClick={() => router.push("/auth/signin")}
            >
              ← Back to Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgetPassword;
