"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Ticket,
  DollarSign,
  ShoppingCart,
  Loader2,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import useRequest from "@/hooks/use-request";

export default function TicketShow() {
  // const searchParams = useSearchParams();
  const router = useRouter();

  const ticketId = 'searchParams.get("ticketId")';
  const ticketTitle = 'searchParams.get("ticketTitle")';
  const ticketPrice = 'searchParams.get("ticketPrice")';

  const [isPurchasing, setIsPurchasing] = useState(false);

  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticketId,
    },
    onSuccess: (order: any) => {
      router.push(`/orders/${order.id}?order=${JSON.stringify(order)}`);
    },
  });

  const handlePurchase = async () => {
    if (!ticketId) return;

    setIsPurchasing(true);
    try {
      await doRequest();
    } finally {
      setIsPurchasing(false);
    }
  };

  if (!ticketId || !ticketTitle || !ticketPrice) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertDescription>Ticket information not found.</AlertDescription>
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
    <div className="container w-full mx-auto py-8 px-4">
      {/* Back Button */}
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tickets
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ticket Details Card */}
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold flex items-center">
                <Ticket className="mr-2 h-6 w-6 text-blue-600" />
                Ticket Details
              </CardTitle>
              <Badge variant="secondary" className="text-sm">
                Available
              </Badge>
            </div>
            <CardDescription>
              Complete your purchase to secure this ticket
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Ticket Title */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {ticketTitle}
              </h2>
              <div className="flex items-center text-lg text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                One-time purchase
              </div>
            </div>

            {/* Price Display */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <DollarSign className="h-6 w-6 text-green-600" />
                <span className="text-4xl font-bold text-green-600">
                  {ticketPrice}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Total amount due</p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">What iss Included</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Instant digital ticket delivery
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Secure payment processing
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Mobile-friendly access
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  24/7 customer support
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Purchase Card */}
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <CardTitle className="text-xl flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5 text-green-600" />
              Complete Purchase
            </CardTitle>
            <CardDescription>Secure your ticket with one click</CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Order Summary */}
            <div className="space-y-4">
              <h3 className="font-semibold">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Ticket:</span>
                  <span className="font-medium">{ticketTitle}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-semibold text-green-600">
                    ${ticketPrice}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t pt-3">
                  <span className="font-semibold">Total:</span>
                  <span className="text-xl font-bold text-green-600">
                    ${ticketPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Errors */}
            {errors && (
              <Alert variant="destructive">
                <AlertDescription>{errors}</AlertDescription>
              </Alert>
            )}

            {/* Purchase Button */}
            <Button
              onClick={handlePurchase}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
              disabled={isPurchasing}
            >
              {isPurchasing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Purchase Ticket
                </>
              )}
            </Button>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-blue-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Secure Payment</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Your payment is processed securely. All transactions are
                encrypted and protected.
              </p>
            </div>

            {/* Additional Info */}
            <div className="text-center text-sm text-muted-foreground space-y-1">
              <p>🔒 256-bit SSL encryption</p>
              <p>💳 Multiple payment methods accepted</p>
              <p>⚡ Instant confirmation</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
