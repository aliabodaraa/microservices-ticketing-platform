"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, KeyRound, Loader2, ArrowRight } from "lucide-react";
import useRequest from "@/hooks/use-request";

const ResetingPassword = () => {
  // const searchParams = useSearchParams();
  const token = 'searchParams.get("token")';
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { doRequest, errors } = useRequest({
    url: "/api/users/reset-password",
    method: "post",
    onSuccess: () => {
      router.push("/auth/signin");
    },
  });

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) {
      console.error("No token found");
      return;
    }

    setLoader(true);
    try {
      await doRequest({
        props: { newPassword, token },
      });
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
            Create a new secure password for your account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-medium">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 pr-10 py-2"
                  required
                  minLength={6}
                  disabled={loader}
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loader}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Password must be at least 6 characters long
              </p>
            </div>

            {/* Security Tips */}
            <Alert className="bg-blue-50 border-blue-200">
              <Lock className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm">
                Choose a strong password that you haven not used before
              </AlertDescription>
            </Alert>

            {/* Errors */}
            {errors && (
              <Alert variant="destructive">
                <AlertDescription>{errors}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              size="lg"
              disabled={loader || !newPassword || newPassword.length < 6}
            >
              {loader ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

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

export default ResetingPassword;
