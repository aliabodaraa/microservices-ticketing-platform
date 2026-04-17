import { buildClient } from "@/api/build-client";
import Tickets from "@/components/tickets";
import { CardCompact } from "@/components/card-compact";
import { Heading } from "@/components/heading";
import { TicketCreation } from "@/features/ticket/components/create-ticket-form";
async function getTickets() {
  const client = buildClient();
  const { data } = await client.get("/api/tickets");
  return data;
}

export default async function TicketsPage() {
  const tickets: any[] = await getTickets();

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading title="My Tickets" description="All your tickets at one place" />

      <CardCompact
        title="Create Ticket"
        description="A new ticket will be created"
        className="w-full max-w-[420px] self-center"
        content={<TicketCreation />}
      />
      <Tickets tickets={tickets} />
    </div>
  );
}
