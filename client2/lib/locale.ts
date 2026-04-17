import Negotiator from "negotiator";
import { NextRequest } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import { i18n } from "@/i18n.config";

export function getLocale(request: NextRequest): string | undefined {
  const negotiatiorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatiorHeaders[key] = value));

  //@ts-ignore locales are readonly
  const locales: string[] = i18n.locales;
  const languages = new Negotiator({
    headers: negotiatiorHeaders,
  }).languages();

  const locale = matchLocale(languages, locales, i18n.defaultLocale);
  return locale;
}
