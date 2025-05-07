import { ApiError } from "@/lib/errors";
import { getAuthenticatedUser } from "@/lib/getAuthenticatedUser";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);

    const customers = await stripe.customers.list({
      email: user.email!,
      limit: 1,
    });

    if (customers.data.length === 0) {
      throw new ApiError("Customer not found");
    }

    const customerId = customers.data[0].id;

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      throw new ApiError("No active subscription found to upgrade");
    }

    const subscription = subscriptions.data[0];

    const updatedSubscription = await stripe.subscriptions.update(
      subscription.id,
      {
        items: [
          {
            id: subscription.items.data[0].id,
            price: process.env.NEXT_PUBLIC_PRO_PRICE_ID,
          },
        ],
        proration_behavior: "always_invoice",
        payment_behavior: "default_incomplete",
        // expand: ["latest_invoice.payment_intent"],
      }
    );

    let paymentIntent: Stripe.PaymentIntent | undefined;
    if (
      updatedSubscription.latest_invoice &&
      typeof updatedSubscription.latest_invoice !== "string" &&
      "payment_intent" in updatedSubscription.latest_invoice &&
      updatedSubscription.latest_invoice.payment_intent &&
      typeof updatedSubscription.latest_invoice.payment_intent !== "string"
    ) {
      paymentIntent = updatedSubscription.latest_invoice
        .payment_intent as Stripe.PaymentIntent;
    }

    return NextResponse.json({ clientSecret: paymentIntent?.client_secret });
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new ApiError("Unknown error");
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
