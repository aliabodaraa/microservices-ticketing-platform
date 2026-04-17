"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle2, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

const EmailSent = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-lg text-center">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-4">
              <Mail className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Check Your Email
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            We have sent you a magic link to sign in to your account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Email sent successfully!</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>📧 Check your inbox for an email from us</p>
            <p>🔗 Click the magic link in the email</p>
            <p>⚡ You will be signed in automatically</p>
            <p className="text-xs mt-2">
              The link will expire in 15 minutes for security
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            <Button asChild variant="default" className="w-full">
              <Link href="/auth/signin">
                <RefreshCw className="mr-2 h-4 w-4" />
                Resend Email
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-xs text-muted-foreground">
            Did not receive the email? Check your spam folder or
            <Link href="/auth/signin" className="text-blue-600 hover:underline">
              try again
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailSent;
