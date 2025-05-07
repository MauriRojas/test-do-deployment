"use client";

import { useEffect, useState } from "react";
import {
  getSubscriptionClient,
  cancelSubscriptionClient,
  createCustomerClient,
  updateToProSubscriptionClient,
} from "@/lib/services/stripe";
import type Stripe from "stripe";
import StripeCheckout from "./StripeCheckout";

const SubscriptionPage = () => {
  const [subscription, setSubscription] = useState<Stripe.Subscription | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upgrading, setUpgrading] = useState(false);

  const fetchSubscription = async () => {
    try {
      await createCustomerClient();
      const { subscription } = await getSubscriptionClient();
      setSubscription(subscription);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Error loading subscription");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      await cancelSubscriptionClient();
      await fetchSubscription();
    } catch {
      setError("Failed to cancel subscription");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeToPro = async () => {
    setUpgrading(true);
    try {
      const { clientSecret } = await updateToProSubscriptionClient();
      if (clientSecret) {
        window.location.reload();
      }
    } catch {
      setError("Upgrade failed");
    } finally {
      setUpgrading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const basePlanId = process.env.NEXT_PUBLIC_PRICE_ID;
  const proPlanId = process.env.NEXT_PUBLIC_PRO_PRICE_ID;

  const currentPlan = subscription?.items.data[0].price.id;

  const isBasePlan = currentPlan === basePlanId;
  const isProPlan = currentPlan === proPlanId;

  if (loading) return <p>Loading subscription data...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Subscription</h1>

      {subscription ? (
        <>
          <p>
            Subscription status: <strong>{subscription.status}</strong> (
            {isProPlan ? "Pro Plan" : isBasePlan ? "Base Plan" : "Unknown Plan"}
            )
          </p>

          {isBasePlan && (
            <button
              onClick={handleUpgradeToPro}
              disabled={upgrading}
              className="mt-4 bg-purple-500 text-white px-4 py-2 rounded"
            >
              {upgrading ? "Upgrading..." : "Upgrade to PRO"}
            </button>
          )}

          <button
            onClick={handleCancel}
            disabled={loading}
            className="mt-4 ml-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Cancel Subscription
          </button>
        </>
      ) : (
        <>
          <StripeCheckout
            priceId={basePlanId!}
            buttonText="Subscribe to Base Plan"
            onSubscribed={fetchSubscription}
          />
          <StripeCheckout
            priceId={proPlanId!}
            buttonText="Subscribe to Pro Plan"
            onSubscribed={fetchSubscription}
          />
        </>
      )}
    </div>
  );
};

export default SubscriptionPage;
