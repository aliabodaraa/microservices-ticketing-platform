export const homePath = (lang: "ar" | "en") => `/${lang}/`;

export const signUpPath = (lang: "ar" | "en") => `/${lang}/auth/signup`;
export const signInPath = (lang: "ar" | "en") => `/${lang}/auth/signin`;
export const passwordForgotPath = (lang: "ar" | "en") =>
  `/${lang}/auth/forget-password`;

export const accountProfilePath = (lang: "ar" | "en") =>
  `/${lang}/account/profile`;
export const accountPasswordPath = (lang: "ar" | "en") =>
  `/${lang}/account/password`;

export const ticketsPath = (lang: "ar" | "en") => `/${lang}/tickets`;
export const ticketPath = (lang: "ar" | "en", ticketId: string) =>
  `/${lang}/tickets/${ticketId}`;
export const ticketEditPath = (lang: "ar" | "en", ticketId: string) =>
  `/${lang}/tickets/${ticketId}/edit`;

export const settingsPath = (lang: "ar" | "en") => `/${lang}/settings`;
export const ordersPath = (lang: "ar" | "en") => `/${lang}/orders`;
export const _2faPath = (lang: "ar" | "en") => `/${lang}/auth/2fa`;

export const signUpMlPath = (lang: "ar" | "en") => `/${lang}/auth/signup-ml`;
export const signInMlPath = (lang: "ar" | "en") => `/${lang}/auth/signin-ml`;
