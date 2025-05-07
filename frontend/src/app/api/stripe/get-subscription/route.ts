import { ApiError } from "@/lib/errors";
import { getAuthenticatedUser } from "@/lib/getAuthenticatedUser";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);

    const customers = await stripe.customers.list({
      email: user.email!,
      limit: 1,
    });
    if (customers.data.length === 0) {
      return NextResponse.json({ subscription: null });
    }

    const customerId = customers.data[0].id;
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      expand: ["data.default_payment_method"],
    });

    const activeSub = subscriptions.data.find((s) => s.status === "active");
    return NextResponse.json({ subscription: activeSub || null });
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new ApiError("Unknown error");
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
