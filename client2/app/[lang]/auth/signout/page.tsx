"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2, CheckCircle2, Home } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import useRequest from "@/hooks/use-request";

const SignOut = () => {
  const [isSigningOut, setIsSigningOut] = useState(true);
  const [isSignedOut, setIsSignedOut] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const router = useRouter();
  const { refreshUser } = useAuth();

  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: async () => {
      await refreshUser();
      setIsSigningOut(false);
      setIsSignedOut(true);

      // Redirect after showing success message
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            router.push("/");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
  });

  useEffect(() => {
    doRequest();
  }, [doRequest]);

  const handleManualRedirect = () => {
    router.push("/");
  };

  if (isSigningOut) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md shadow-lg text-center">
          <CardHeader className="space-y-6 pb-8">
            <div className="flex justify-center">
              <div className="rounded-full bg-blue-100 p-6">
                <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Signing You Out
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Please wait while we securely sign you out...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isSignedOut) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <Card className="w-full max-w-md shadow-lg text-center">
          <CardHeader className="space-y-6 pb-8">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-6">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Successfully Signed Out
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              You have been securely signed out of your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Countdown */}
            <div className="space-y-4">
              <div className="flex justify-center items-center space-x-3">
                <Loader2 className="h-6 w-6 text-green-600 animate-spin" />
                <div className="text-left">
                  <p className="font-semibold text-gray-700">Redirecting...</p>
                  <p className="text-sm text-muted-foreground">
                    Taking you home in {countdown} second
                    {countdown !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Manual Redirect Button */}
            <Button
              onClick={handleManualRedirect}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              <Home className="mr-2 h-4 w-4" />
              Go Home Now
            </Button>

            {/* Security Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 text-blue-700">
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Your session has been securely closed
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default SignOut;
