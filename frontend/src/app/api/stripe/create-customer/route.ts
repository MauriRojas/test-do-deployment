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
    if (customers.data.length > 0) {
      return NextResponse.json({ customerId: customers.data[0].id });
    }

    const customer = await stripe.customers.create({
      email: user.email!,
      metadata: { supabaseId: user.id },
    });

    return NextResponse.json({ customerId: customer.id });
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new ApiError("Unknown error");
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
