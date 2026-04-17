"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useRequest from "@/hooks/use-request";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield, MailCheck, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

const MLinksVerificationRedirection = () => {
  // const searchParams = useSearchParams();
  const token = 'searchParams.get("token")';
  const router = useRouter();
  const [loader, setLoader] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const { refreshUser } = useAuth();

  const { doRequest, errors } = useRequest({
    url: "/api/users/verify-magic-links",
    method: "get",
    onSuccess: async (res: any) => {
      await refreshUser();
      if (res?.requires2FA) {
        localStorage.setItem("tempToken", res.tempToken);
        router.push("/auth/2fa");
      } else {
        router.push("/");
      }
    },
  });

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        // Countdown timer
        const countdownInterval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        // Verify after delay
        setTimeout(async () => {
          await doRequest({ params: { token } });
          setLoader(false);
        }, 3000);

        return () => clearInterval(countdownInterval);
      } else {
        console.error("No token found in URL");
        setLoader(false);
      }
    };

    verifyToken();
  }, [token, doRequest]);

  const handleManualRedirect = () => {
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <Card className="w-full max-w-2xl shadow-xl text-center">
        <CardHeader className="space-y-6 pb-8">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-6">
              <MailCheck className="h-20 w-20 text-green-600" />
            </div>
          </div>

          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Email Verified Successfully!
          </CardTitle>
          <CardDescription className="text-xl text-muted-foreground">
            Your email has been confirmed and you are being redirected
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Loading Animation */}
          {loader && (
            <div className="space-y-4">
              <div className="flex justify-center items-center space-x-4">
                <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
                <div className="text-left">
                  <p className="font-semibold text-green-700">
                    Completing verification...
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Redirecting in {countdown} second
                    {countdown !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="flex justify-center space-x-8 text-sm">
                <div className="text-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
                  <span className="text-green-600 font-medium">
                    Email Verified
                  </span>
                </div>
                <div className="text-center">
                  <div
                    className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                      countdown < 2 ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></div>
                  <span
                    className={
                      countdown < 2
                        ? "text-green-600 font-medium"
                        : "text-gray-500"
                    }
                  >
                    Session Created
                  </span>
                </div>
                <div className="text-center">
                  <div
                    className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                      countdown < 1 ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></div>
                  <span
                    className={
                      countdown < 1
                        ? "text-green-600 font-medium"
                        : "text-gray-500"
                    }
                  >
                    Redirecting
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 2FA Notice */}
          <Alert className="bg-blue-50 border-blue-200">
            <Shield className="h-4 w-4 text-blue-600" />
            <AlertDescription>
              If you have two-factor authentication enabled, you will be
              redirected to enter your verification code
            </AlertDescription>
          </Alert>

          {/* Errors */}
          {errors && (
            <Alert variant="destructive">
              <AlertDescription>{errors}</AlertDescription>
            </Alert>
          )}

          {/* Manual Redirect Button */}
          <Button
            onClick={handleManualRedirect}
            className="bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            Continue to App
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          {/* Troubleshooting */}
          <div className="text-center text-sm text-muted-foreground space-y-1">
            <p>Not redirecting automatically?</p>
            <Button
              variant="link"
              className="text-green-600 hover:text-green-800"
              onClick={handleManualRedirect}
            >
              Click here to continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MLinksVerificationRedirection;
