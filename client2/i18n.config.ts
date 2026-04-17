export const i18n = {
  defaultLocale: "en",
  locales: ["en", "ar"] as const, // Add all your locales here
} as const;

export type Locale = (typeof i18n)["locales"][number];
