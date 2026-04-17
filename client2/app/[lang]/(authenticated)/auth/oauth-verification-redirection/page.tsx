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
import { CheckCircle2, Loader2, Home, ArrowRight } from "lucide-react";

const OAuthVerificationRedirection = () => {
  const [loader, setLoader] = useState(true);
  const [countdown, setCountdown] = useState(2);
  const router = useRouter();

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const redirectTimer = setTimeout(() => {
      router.push("/");
      setLoader(false);
    }, 2000);

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  const handleManualRedirect = () => {
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl text-center">
        <CardHeader className="space-y-6 pb-8">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-6">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
          </div>

          <CardTitle className="text-3xl font-bold text-gray-900">
            Successfully Logged In!
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            You are being redirected to your dashboard
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Loading Animation */}
          {loader && (
            <div className="space-y-4">
              <div className="flex justify-center items-center space-x-3">
                <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                <div className="text-left">
                  <p className="font-semibold text-gray-700">Redirecting...</p>
                  <p className="text-sm text-muted-foreground">
                    Taking you to the app in {countdown} second
                    {countdown !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Manual Redirect Button */}
          <Button
            onClick={handleManualRedirect}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          {/* Help Text */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Not redirecting automatically?</p>
            <Button
              variant="link"
              className="text-blue-600 hover:text-blue-800 p-0 h-auto"
              onClick={handleManualRedirect}
            >
              Click here to continue immediately
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthVerificationRedirection;
