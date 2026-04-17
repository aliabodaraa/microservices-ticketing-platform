import {
  LucideLibrary,
  LucideSettings,
  LucideShoppingCart,
  LucideTicket,
} from "lucide-react";
import { homePath, ordersPath, settingsPath, ticketsPath } from "@/paths";
import { NavItem } from "./types";

export const navItems: (
  translations: Record<string, any>,
  lang: "ar" | "en"
) => NavItem[] = (translations: Record<string, any>, lang: "ar" | "en") => [
  {
    title: translations.allTicket,
    icon: <LucideLibrary />,
    href: homePath(lang),
  },
  {
    title: translations.tickets,
    icon: <LucideTicket />,
    href: ticketsPath(lang),
  },
  {
    title: translations.orders,
    icon: <LucideShoppingCart />,
    href: ordersPath(lang),
  },
  {
    separator: true,
    title: translations.settings,
    icon: <LucideSettings />,
    href: settingsPath(lang),
  },
];

export const closedClassName =
  "text-background opacity-0 transition-all duration-300 group-hover:z-40 group-hover:ml-4 group-hover:rounded group-hover:bg-foreground group-hover:p-2 group-hover:opacity-100";
