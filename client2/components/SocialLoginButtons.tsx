import React from "react";
import { Button } from "@/components/ui/button";
import { Github, Chrome, Loader2 } from "lucide-react";
import { useState } from "react";

const SocialLoginButtons = () => {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleSocialLogin = (provider: string) => {
    setLoadingProvider(provider);
    const urls: { [key: string]: string } = {
      google: "https://ticketing.dev/api/users/google",
      github: "https://ticketing.dev/api/users/github",
    };
    window.location.href = urls[provider];
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
      {/* Google Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full relative border-gray-300 hover:bg-gray-50 transition-colors"
        onClick={() => handleSocialLogin("google")}
        disabled={!!loadingProvider}
      >
        {loadingProvider === "google" ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Chrome className="h-4 w-4 mr-2 text-red-500" />
        )}
        <span className="flex-1 text-center">
          {loadingProvider === "google" ? "Connecting..." : "Google"}
        </span>
      </Button>

      {/* GitHub Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full relative border-gray-300 hover:bg-gray-50 transition-colors"
        onClick={() => handleSocialLogin("github")}
        disabled={!!loadingProvider}
      >
        {loadingProvider === "github" ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Github className="h-4 w-4 mr-2" />
        )}
        <span className="flex-1 text-center">
          {loadingProvider === "github" ? "Connecting..." : "GitHub"}
        </span>
      </Button>
    </div>
  );
};

export default SocialLoginButtons;
