"use client";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

import { LucideKanban } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { homePath, signInPath, signUpPath } from "@/paths";
import { AccountDropdown } from "./account-dropdown";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import LanguageSwitcher from "./LangSwitcher";
import { useEffect, useState } from "react";
import { getDictionary } from "@/lib/dictionarty";
import { usePathname } from "next/navigation";

const Header = () => {
  const { user, isFetched } = useAuth();
  const [headerTranslation, setheaderTranslation] = useState<any>({});
  const lang = usePathname().startsWith("/ar") ? "ar" : "en";
  useEffect(() => {
    const translationFn = async () => {
      const headerTrans = await getDictionary(lang);
      setheaderTranslation(headerTrans.header);
    };
    translationFn();
  }, [lang]);
  console.log("currentUser", user);
  // const links = [
  //   !user && { label: "Sign Up", href: "/auth/signup", icon: User },
  //   !user && { label: "Sign In", href: "/auth/signin", icon: LogOut },
  //   user && { label: "Sign Out", href: "/auth/signout", icon: LogOut },
  // ].filter(Boolean) as Array<{ label: string; href: string; icon: any }>;
  if (!isFetched) {
    return null;
  }
  const navItems = user ? (
    <AccountDropdown user={user} />
  ) : (
    <>
      <Link
        href={signUpPath(lang)}
        className={buttonVariants({ variant: "outline" })}
      >
        {headerTranslation.signUp}
      </Link>
      <Link
        href={signInPath(lang)}
        className={buttonVariants({ variant: "default" })}
      >
        {headerTranslation.signIn}
      </Link>
    </>
  );

  return (
    <nav
      className="
      animate-header-from-top
      supports-backdrop-blur:bg-background/60
      fixed left-0 right-0 top-0 z-20
      border-b bg-background/95 backdrop-blur
      w-full flex py-2.5 px-5 justify-between
    "
    >
      <div className="flex align-items gap-x-2">
        <Link
          href={homePath(lang)}
          className={buttonVariants({ variant: "ghost" })}
        >
          <LucideKanban />
          <h1 className="text-lg font-semibold">{headerTranslation.title}</h1>
        </Link>
      </div>
      <div className="flex align-items gap-x-2">
        <LanguageSwitcher />
        <ThemeSwitcher />
        {navItems}
      </div>
    </nav>
  );
};

export default Header;
