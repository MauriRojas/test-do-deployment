import { fetchWithAuth } from "../fetchWithAuth";
import type Stripe from "stripe";

export const getSubscriptionClient = async (): Promise<{
  subscription: Stripe.Subscription | null;
}> => {
  return await fetchWithAuth("/api/stripe/get-subscription");
};

export const createSubscriptionClient = async (
  priceId: string
): Promise<{
  clientSecret: string;
}> => {
  return await fetchWithAuth("/api/stripe/create-subscription", {
    method: "POST",
    body: JSON.stringify({ priceId }),
  });
};

export const cancelSubscriptionClient = async (): Promise<{
  canceled: boolean;
}> => {
  return await fetchWithAuth("/api/stripe/cancel-subscription", {
    method: "POST",
  });
};

export const createCustomerClient = async (): Promise<{
  customerId: string;
}> => {
  return await fetchWithAuth("/api/stripe/create-customer", {
    method: "POST",
  });
};

export const updateToProSubscriptionClient = async (): Promise<{
  clientSecret: string;
}> => {
  return await fetchWithAuth("/api/stripe/update-to-pro-subscription", {
    method: "POST",
  });
};
