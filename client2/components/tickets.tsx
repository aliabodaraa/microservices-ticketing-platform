"use client";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { useAuth } from "@/features/auth/hooks/use-auth";

export default function Tickets({
  tickets,
}: {
  tickets: Record<string, any>[];
}) {
  const { isFetched } = useAuth();

  return (
    <>
      {
        <div className="container mx-auto py-10">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold mb-6">Tickets</h1>
            {isFetched && (
              <Button asChild variant="outline" size="sm">
                <Link
                  href={{
                    pathname: `/tickets/new`,
                  }}
                >
                  Create A Ticket
                </Link>
              </Button>
            )}
          </div>
          <Table>
            <TableCaption>A list of your recent tickets.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Title</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.title}</TableCell>
                  <TableCell>${ticket.price}</TableCell>
                  <TableCell className="text-right">
                    <Suspense>
                      <Button asChild variant="outline" size="sm">
                        <Link
                          href={{
                            pathname: `/tickets/${ticket.id}`,
                            query: {
                              ticketId: ticket.id,
                              ticketTitle: ticket.title,
                              ticketPrice: ticket.price,
                            },
                          }}
                        >
                          View
                        </Link>
                      </Button>
                    </Suspense>
                    <Suspense>
                      <Button asChild variant="outline" size="sm">
                        <Link
                          href={{
                            pathname: `/tickets/${ticket.id}/edit`,
                            query: {
                              ticketId: ticket.id,
                              ticketTitle: ticket.title,
                              ticketPrice: ticket.price,
                            },
                          }}
                        >
                          Edit
                        </Link>
                      </Button>
                    </Suspense>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {tickets.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No tickets found.
            </div>
          )}
        </div>
      }
    </>
  );
}
