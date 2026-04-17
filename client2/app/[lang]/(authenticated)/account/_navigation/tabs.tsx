"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { accountPasswordPath, accountProfilePath } from "@/paths";

const AccountTabs = () => {
  const pathName = usePathname();
  const lang = usePathname().startsWith("/ar") ? "ar" : "en";

  return (
    <Tabs value={pathName.split("/").at(-1)}>
      <TabsList>
        <TabsTrigger value="profile" asChild>
          <Link href={accountProfilePath(lang)}>Profile</Link>
        </TabsTrigger>
        <TabsTrigger value="password" asChild>
          <Link href={accountPasswordPath(lang)}>Password</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export { AccountTabs };
