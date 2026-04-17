import { buildClient } from "@/api/build-client";
import Tickets from "@/components/tickets";
import { Locale } from "@/i18n.config";
import { getDictionary } from "@/lib/dictionarty";

// Define proper type for tickets
interface Ticket {
  id: string;
  title: string;
  price: number;
  // add other ticket properties
}

async function getTickets(): Promise<Ticket[]> {
  const client = buildClient();
  const { data } = await client.get<Ticket[]>("/api/tickets"); // Added type
  return data;
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  let lang: Locale = (await params).lang;
  // Load both dictionary and tickets in parallel
  const [dictionary, tickets] = await Promise.all([
    getDictionary(lang),
    getTickets(),
  ]);

  return (
    <>
      <h1>{dictionary.page.home.title}</h1>
      <Tickets tickets={tickets} />
    </>
  );
}
