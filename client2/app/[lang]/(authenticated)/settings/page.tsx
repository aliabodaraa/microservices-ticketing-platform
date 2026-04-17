"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Mail,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Info,
  Loader2,
  Lock,
  Unlock,
  Clock,
  Key,
  Settings as SettingsIcon,
} from "lucide-react";
import useRequest from "@/hooks/use-request";

const SettingsPage = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [setupToken, setSetupToken] = useState("");
  const [message, setMessage] = useState("");
  const [loadingSetup, setLoadingSetup] = useState(false);
  const [activeTab, setActiveTab] = useState("2fa");
  const [require2FAAfterMagicLink, setRequire2FAAfterMagicLink] =
    useState(false);

  const { doRequest: twoFaSetupRequestFn, errors: twoFaSetupRequestError } =
    useRequest({
      url: "/api/users/2fa/setup",
      method: "post",
      onSuccess: ({ qrCode }: any) => {
        setQrCode(qrCode);
        setLoadingSetup(false);
      },
    });

  const { doRequest: verifySetupFn, errors: verifySetupErrors } = useRequest({
    url: "/api/users/2fa/verify-setup",
    method: "post",
    onSuccess: () => {
      setTwoFactorEnabled(true);
      setQrCode(null);
      setSetupToken("");
      setMessage("2FA has been successfully enabled");
    },
  });

  const { doRequest: disable2FAFn, errors: disable2FAErrors } = useRequest({
    url: "/api/users/2fa/disable",
    method: "post",
    onSuccess: () => {
      setTwoFactorEnabled(false);
      setMessage("2FA has been disabled");
      if (require2FAAfterMagicLink) toggle2FAAfterMagicLinkFn();
    },
  });

  const { doRequest: meFn, errors: meError } = useRequest({
    url: "/api/users/me",
    method: "get",
    onSuccess: ({ currentUser }) => {
      setTwoFactorEnabled(currentUser?.twoFactorEnabled);
      setRequire2FAAfterMagicLink(
        currentUser?.require2FAAfterMagicLink || false
      );
    },
  });

  const {
    doRequest: toggle2FAAfterMagicLinkFn,
    errors: toggle2FAAfterMagicLinkErrors,
  } = useRequest({
    url: "/api/users/magic-link-after-2fa",
    method: "post",
    body: { enabled: !require2FAAfterMagicLink },
    onSuccess: () => {
      setRequire2FAAfterMagicLink(!require2FAAfterMagicLink);
      if (activeTab != "2fa") {
        setMessage(
          `2FA after Magic Link ${
            !require2FAAfterMagicLink ? "enabled" : "disabled"
          }`
        );
      }
    },
  });

  useEffect(() => {
    meFn();
  }, []);

  const startSetup = async () => {
    setLoadingSetup(true);
    try {
      await twoFaSetupRequestFn();
    } finally {
      setLoadingSetup(false);
    }
  };

  const verifySetup = async () => {
    await verifySetupFn({ props: { token: setupToken } });
  };

  const disable2FA = async () => {
    await disable2FAFn();
  };

  return (
    <div className="container w-full mx-auto py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <SettingsIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold">Security Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account security preferences and authentication methods
        </p>
      </div>

      {/* Main Card */}
      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-xl flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Security Configuration
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="2fa" className="flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                Two-Factor Authentication
              </TabsTrigger>
              <TabsTrigger value="magiclink" className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                Magic Links
              </TabsTrigger>
            </TabsList>

            {/* Messages and Errors */}
            {message && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0"
                  onClick={() => setMessage("")}
                >
                  ×
                </Button>
              </Alert>
            )}

            {(verifySetupErrors ||
              twoFaSetupRequestError ||
              disable2FAErrors ||
              meError ||
              toggle2FAAfterMagicLinkErrors) && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {verifySetupErrors ||
                    twoFaSetupRequestError ||
                    disable2FAErrors ||
                    meError ||
                    toggle2FAAfterMagicLinkErrors}
                </AlertDescription>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0 text-white"
                  onClick={() => setMessage("")}
                >
                  ×
                </Button>
              </Alert>
            )}

            {/* 2FA Tab Content */}
            <TabsContent value="2fa" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Badge variant={twoFactorEnabled ? "default" : "secondary"}>
                  {twoFactorEnabled ? "Enabled" : "Not Enabled"}
                </Badge>
              </div>

              {twoFactorEnabled ? (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle>2FA Enabled</AlertTitle>
                  <AlertDescription className="flex justify-between items-center">
                    <span>
                      Two-factor authentication is currently active on your
                      account.
                    </span>
                    <Button onClick={disable2FA} variant="outline" size="sm">
                      Disable 2FA
                    </Button>
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {qrCode ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Complete 2FA Setup
                        </CardTitle>
                        <CardDescription>
                          Scan this QR code with your authenticator app, then
                          enter the verification code below.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-center">
                          <Image
                            src={qrCode}
                            alt="Scan QR for 2FA"
                            width={200}
                            height={200}
                            className="rounded-lg border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="token">Verification Code</Label>
                          <Input
                            id="token"
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={setupToken}
                            onChange={(e) => setSetupToken(e.target.value)}
                          />
                        </div>
                        <Button onClick={verifySetup} className="w-full">
                          Verify and Enable 2FA
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <Button
                      onClick={startSetup}
                      disabled={loadingSetup}
                      className="w-full"
                    >
                      {loadingSetup ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Setting up...
                        </>
                      ) : (
                        <>
                          <QrCode className="mr-2 h-4 w-4" />
                          Set Up Two-Factor Authentication
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Magic Links Tab Content */}
            <TabsContent value="magiclink" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Magic Links</h3>
                  <p className="text-muted-foreground">
                    Passwordless authentication with optional 2FA requirement
                  </p>
                </div>
                <Badge
                  variant={require2FAAfterMagicLink ? "default" : "secondary"}
                >
                  {require2FAAfterMagicLink ? "Enhanced Security" : "Standard"}
                </Badge>
              </div>

              {/* Magic Links Toggle */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Require 2FA After Magic Link
                  </CardTitle>
                  <CardDescription>
                    Additional security layer after magic link authentication
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="2fa-after-magiclink">
                        Enable 2FA Verification
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Require 2FA code after signing in with magic link
                      </p>
                    </div>
                    <Switch
                      id="2fa-after-magiclink"
                      checked={require2FAAfterMagicLink}
                      onCheckedChange={() => toggle2FAAfterMagicLinkFn()}
                      disabled={!twoFactorEnabled}
                    />
                  </div>
                  {!twoFactorEnabled && (
                    <Alert className="mt-4 bg-amber-50 border-amber-200 text-black">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <AlertTitle>2FA Required</AlertTitle>
                      <AlertDescription>
                        You need to enable 2FA first to use this feature
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Information Card */}
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <Info className="mr-2 h-4 w-4" />
                    How Magic Links Work
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Secure Email Link</p>
                      <p className="text-sm text-muted-foreground">
                        Request a secure sign-in link sent to your email
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium">One-Click Authentication</p>
                      <p className="text-sm text-muted-foreground">
                        Click the link to automatically authenticate
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    {require2FAAfterMagicLink ? (
                      <Lock className="h-4 w-4 text-green-600 mt-0.5" />
                    ) : (
                      <Unlock className="h-4 w-4 text-amber-600 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium">
                        {require2FAAfterMagicLink
                          ? "2FA Protection"
                          : "Direct Access"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {require2FAAfterMagicLink
                          ? "2FA required after magic link for extra security"
                          : "No additional verification after magic link"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Time-Limited Access</p>
                      <p className="text-sm text-muted-foreground">
                        Links expire after 15 minutes for security
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Key className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Passwordless Convenience</p>
                      <p className="text-sm text-muted-foreground">
                        No passwords to remember or manage
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Alert
                className={
                  require2FAAfterMagicLink
                    ? "bg-blue-50 border-blue-200 text-black"
                    : "bg-amber-50 border-amber-200 text-black"
                }
              >
                <Info className="h-4 w-4" />
                <AlertTitle>Security Notice</AlertTitle>
                <AlertDescription>
                  {require2FAAfterMagicLink
                    ? "With 2FA enabled after magic links, your account has maximum security protection."
                    : "Consider enabling 2FA after magic links for enhanced security."}
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
