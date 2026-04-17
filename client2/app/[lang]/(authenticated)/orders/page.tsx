import { buildClient } from "@/api/build-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Ticket,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";

async function getOrders() {
  const headersList = await headers();
  const client = buildClient({
    Cookie: headersList.get("cookie") || "",
    Authorization: headersList.get("authorization") || "",
  });

  const { data } = await client.get("/api/orders");
  return data;
}

export default async function Orders() {
  const orders: any[] = await getOrders();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "created":
        return "secondary";
      case "cancelled":
        return "destructive";
      case "complete":
        return "default";
      case "awaiting:payment":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle2 className="h-4 w-4 mr-1" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 mr-1" />;
      case "created":
      case "awaiting:payment":
      default:
        return <Clock className="h-4 w-4 mr-1" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <Ticket className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold">My Orders</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Manage and view your ticket orders
        </p>
      </div>

      {/* Orders Card */}
      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-xl flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Order History
          </CardTitle>
          <CardDescription>
            {orders.length} order{orders.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {orders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Ticket</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <Ticket className="h-8 w-8 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-semibold">{order.ticket.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Order #{order.id.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-green-600">
                        ${order.ticket.price}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusVariant(order.status)}
                        className="flex items-center w-fit"
                      >
                        {getStatusIcon(order.status)}
                        {order.status
                          .replace(":", " ")
                          .charAt(0)
                          .toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {order.status === "created" && (
                          <Button asChild size="sm">
                            <Link href={`/orders/${order.id}`}>
                              <Eye className="mr-1 h-3 w-3" />
                              Pay Now
                            </Link>
                          </Button>
                        )}
                        {order.status === "complete" && (
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/tickets/${order.ticket.id}`}>
                              <Eye className="mr-1 h-3 w-3" />
                              View Ticket
                            </Link>
                          </Button>
                        )}
                        {order.status === "cancelled" && (
                          <Button asChild variant="outline" size="sm">
                            <Link href="/tickets">Browse Tickets</Link>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Ticket className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Orders Found
              </h3>
              <p className="text-muted-foreground mb-6">
                You haven not placed any orders yet. Start by browsing available
                tickets.
              </p>
              <Button asChild>
                <Link href="/">Browse Tickets</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      {orders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Completed
                  </p>
                  <p className="text-2xl font-bold">
                    {orders.filter((o) => o.status === "complete").length}
                  </p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Pending
                  </p>
                  <p className="text-2xl font-bold">
                    {
                      orders.filter(
                        (o) =>
                          o.status === "created" ||
                          o.status === "awaiting:payment"
                      ).length
                    }
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
