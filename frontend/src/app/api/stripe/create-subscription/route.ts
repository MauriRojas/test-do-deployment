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
    const { priceId }: { priceId: string } = await req.json();

    const customers = await stripe.customers.list({
      email: user.email!,
      limit: 1,
    });

    let customerId = customers.data[0]?.id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: { supabaseId: user.id },
      });
      customerId = customer.id;
    }

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: {
        save_default_payment_method: "on_subscription",
      },
      //   expand: ["latest_invoice.payment_intent"],
    });

    let paymentIntent: Stripe.PaymentIntent | undefined;
    if (
      subscription.latest_invoice &&
      typeof subscription.latest_invoice !== "string" &&
      "payment_intent" in subscription.latest_invoice &&
      subscription.latest_invoice.payment_intent &&
      typeof subscription.latest_invoice.payment_intent !== "string"
    ) {
      paymentIntent = subscription.latest_invoice
        .payment_intent as Stripe.PaymentIntent;
    }

    return NextResponse.json({ clientSecret: paymentIntent?.client_secret });
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new ApiError("Unknown error");
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
