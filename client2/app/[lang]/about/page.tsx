import { Locale } from "@/i18n.config";
import { getDictionary } from "@/lib/dictionarty";

export default async function AboutPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  console.log(lang, "langlanglanglanglanglanglanglanglang");

  const { page } = await getDictionary(lang);

  return <>---------{page.about.title}</>;
}
