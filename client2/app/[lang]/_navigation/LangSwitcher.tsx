"use client"; // Required for interactivity
import { useRouter, usePathname } from "next/navigation";
export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname.startsWith("/ar") ? "ar" : "en";
  console.log(pathname.startsWith("/ar"), "----------");
  const changeLanguage = (locale: string) => {
    router.push(`/${locale}${pathname.replace(/^\/(en|ar)/, "")}`);
  };
  return (
    <div className="flex">
      {lang == "ar" && (
        <button
          className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
          onClick={() => changeLanguage("en")}
        >
          en
        </button>
      )}
      {lang == "en" && (
        <button
          className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
          onClick={() => changeLanguage("ar")}
        >
          ar
        </button>
      )}
    </div>
  );
}
