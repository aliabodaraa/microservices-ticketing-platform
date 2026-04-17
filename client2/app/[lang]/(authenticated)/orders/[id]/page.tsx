"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StripeCheckout from "react-stripe-checkout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, CreditCard, CheckCircle2, XCircle } from "lucide-react";
import useRequest from "@/hooks/use-request";

const OrderShow = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [_isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  // const searchParams = useSearchParams();
  const order = JSON.parse("searchParams.get('order')");

  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: () => router.push("/orders"),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt).getTime() - new Date().getTime();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  const handleToken = async (token: any) => {
    setIsProcessing(true);
    try {
      await doRequest({ props: { token: token.id } });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = Math.max(0, (timeLeft / (15 * 60)) * 100); // 15 minutes total

  if (timeLeft < 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-100 p-4">
        <Card className="w-full max-w-md shadow-lg text-center">
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-red-100 p-4">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Order Expired
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              This order has expired and is no longer available for payment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => router.push("/tickets")} className="w-full">
              Browse Available Tickets
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold flex items-center">
            <CreditCard className="mr-2 h-6 w-6" />
            Complete Your Purchase
          </CardTitle>
          <CardDescription>
            Secure payment for your ticket order
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Order Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ticket:</span>
                  <span className="font-medium">{order.ticket.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-medium">${order.ticket.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={timeLeft > 0 ? "default" : "destructive"}>
                    {timeLeft > 0 ? "Pending" : "Expired"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Timer Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="font-medium">Time Remaining</span>
                </div>
                <Badge variant={timeLeft < 60 ? "destructive" : "default"}>
                  {formatTime(timeLeft)}
                </Badge>
              </div>

              <Progress value={progressPercentage} className="h-2" />

              <p className="text-xs text-muted-foreground">
                Complete payment within {formatTime(timeLeft)} to secure your
                ticket
              </p>
            </div>
          </div>

          {/* Payment Section */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-4">Payment Method</h3>

            {/* Stripe Checkout */}
            <div className="flex justify-center">
              {/* <StripeCheckout
                token={handleToken}
                stripeKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
                amount={order.ticket.price * 100} // Convert to cents
                email={currentUser?.email}
                name="Ticket Purchase"
                description={`Ticket: ${order.ticket.title}`}
                image="/logo.png" // Add your logo
                currency="USD"
              >
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay ${order.ticket.price}
                    </>
                  )}
                </Button>
              </StripeCheckout> */}
              <StripeCheckout
                token={({ id }) => doRequest({ props: { token: id } })}
                stripeKey=""
              />
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <div className="flex items-center space-x-2 text-blue-700">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">Secure Payment</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Your payment is processed securely through Stripe. We never
                store your card details.
              </p>
            </div>
          </div>

          {/* Errors */}
          {errors && (
            <Alert variant="destructive">
              <AlertDescription>{errors}</AlertDescription>
            </Alert>
          )}

          {/* Cancel Button */}
          <div className="text-center">
            <Button variant="outline" onClick={() => router.push("/orders")}>
              Cancel Order
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderShow;
