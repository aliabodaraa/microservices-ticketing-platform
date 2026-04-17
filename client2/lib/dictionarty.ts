import { Locale } from "@/i18n.config";
// import "server-only";

export type Dictionary = {
  header: {
    signUp: string;
    signIn: string;
  };
  navigation: {
    about: string;
    allTicket: string;
    tickets: string;
    orders: string;
    settings: string;
  };
  page: {
    home: {
      title: string;
    };
    about: {
      title: string;
    };
  };
};

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  ar: () => import("@/dictionaries/ar.json").then((module) => module.default),
  en: () => import("@/dictionaries/en.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  // Validate locale exists
  if (!dictionaries[locale]) {
    console.warn(`Locale ${locale} not found, falling back to default`);
    return dictionaries.en();
  }

  try {
    const dictionary = await dictionaries[locale]();
    return dictionary;
  } catch (error) {
    console.error(`Failed to load dictionary for ${locale}:`, error);
    return dictionaries.en(); // Fallback to English
  }
};
