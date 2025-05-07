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
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    const customerId = customers.data[0].id;
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    const sub = subscriptions.data[0];
    if (!sub) {
      return NextResponse.json(
        { error: "No active subscription" },
        { status: 400 }
      );
    }

    await stripe.subscriptions.cancel(sub.id);
    return NextResponse.json({ canceled: true });
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new ApiError("Unknown error");
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
