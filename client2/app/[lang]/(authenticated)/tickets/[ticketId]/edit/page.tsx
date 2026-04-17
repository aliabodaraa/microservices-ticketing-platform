"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Edit,
  DollarSign,
  Loader2,
  ArrowLeft,
  Save,
  History,
} from "lucide-react";
import Link from "next/link";
import useRequest from "@/hooks/use-request";

export default function TicketEdit() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const ticketId = searchParams.get("ticketId");
  const ticketTitle = searchParams.get("ticketTitle");
  const ticketPrice = searchParams.get("ticketPrice");

  const [title, setTitle] = useState(ticketTitle || "");
  const [price, setPrice] = useState(ticketPrice || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { doRequest, errors } = useRequest({
    url: `/api/tickets/${ticketId}`,
    method: "put",
    body: { title, price },
    onSuccess: () => router.push("/"),
  });

  useEffect(() => {
    if (!ticketId) {
      router.push("/");
    }
  }, [ticketId, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await doRequest();
    } finally {
      setIsSubmitting(false);
    }
  };

  const onPriceBlur = () => {
    const value = parseFloat(price);
    if (!isNaN(value)) {
      setPrice(value.toFixed(2));
    }
  };

  const hasChanges = title !== ticketTitle || price !== ticketPrice;

  if (!ticketId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertDescription>
                No ticket selected for editing.
              </AlertDescription>
            </Alert>
            <Button asChild className="w-full mt-4">
              <Link href="/">Back to Tickets</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      {/* Back Button */}
      <Button asChild variant="ghost" className="mb-4">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tickets
        </Link>
      </Button>

      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold flex items-center">
            <Edit className="mr-2 h-6 w-6 text-blue-600" />
            Edit Ticket
          </CardTitle>
          <CardDescription>
            Update your ticket information below
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Original Values */}
          <Card className="bg-muted/30">
            <CardHeader className="py-3">
              <CardTitle className="text-sm flex items-center">
                <History className="mr-2 h-4 w-4" />
                Original Values
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground">Title:</span>
                  <p className="font-medium">{ticketTitle}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Price:</span>
                  <p className="font-medium">${ticketPrice}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Title Field */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Ticket Title
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter ticket title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Price Field */}
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium">
                Price ($)
              </Label>
              <div className="relative">
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  onBlur={onPriceBlur}
                  className="pl-8 pr-4 py-2"
                  required
                  disabled={isSubmitting}
                />
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Errors */}
            {errors && (
              <Alert variant="destructive">
                <AlertDescription>{errors}</AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting || !title || !price || !hasChanges}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
