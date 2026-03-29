import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateUserSubscription } from "@/lib/supabase";
import type { SubscriptionType } from "@/lib/supabase/types";
import { STRIPE_PRICE_IDS } from "@/config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

interface SubscriptionData {
  items: {
    data: Array<{
      price: {
        id: string;
      };
      current_period_end: number;
      current_period_start: number;
    }>;
  };
}

function isCheckoutSession(object: unknown): object is Stripe.Checkout.Session {
  return typeof object === "object" && object !== null && "metadata" in object;
}

function isSubscription(object: unknown): object is Stripe.Subscription {
  return typeof object === "object" && object !== null && "items" in object && "customer" in object;
}

function isCustomer(object: unknown): object is Stripe.Customer {
  return typeof object === "object" && object !== null && "email" in object && !("deleted" in object);
}

function isInvoice(object: unknown): object is Stripe.Invoice {
  return typeof object === "object" && object !== null && "customer_email" in object && "billing_reason" in object;
}

async function getSubscriptionData(subscriptionId: string) {
  const subscriptionResponse = await stripe.subscriptions.retrieve(subscriptionId);
  
  const subscription = subscriptionResponse as unknown as SubscriptionData;

  const firstItem = subscription.items.data[0];
  
  if (!firstItem) {
    throw new Error("No subscription items found");
  }

  const priceId = firstItem.price.id;
  const currentPeriodEnd = firstItem.current_period_end;

  console.log("🔍 Extracted priceId:", priceId);
  console.log("🔍 Extracted currentPeriodEnd:", currentPeriodEnd);
  console.log("🔍 Type of currentPeriodEnd:", typeof currentPeriodEnd);

  if (!priceId) {
    throw new Error("Price ID not found in subscription");
  }

  if (!currentPeriodEnd || typeof currentPeriodEnd !== "number") {
    throw new Error(`Invalid current_period_end: ${currentPeriodEnd}`);
  }

  return {
    priceId,
    currentPeriodEnd,
  };
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {  
  const userEmail = session.metadata?.user_email;
  
  if (!userEmail || !session.subscription) {
    return;
  }

  try {
    const { priceId, currentPeriodEnd } = await getSubscriptionData(
      session.subscription as string
    );

    const plan: SubscriptionType = priceId === STRIPE_PRICE_IDS.PLUS ? "PLUS" : "PRO";

    const expirationDate = new Date(currentPeriodEnd * 1000);

    if (isNaN(expirationDate.getTime())) {
      throw new Error(`Invalid date created from timestamp: ${currentPeriodEnd}`);
    }

    await updateUserSubscription(userEmail, plan, expirationDate);
  } catch (error) {
    throw error;
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  if (invoice.billing_reason !== "subscription_cycle") return;

  const customerEmail = invoice.customer_email;
  const subscriptionId = invoice.parent?.subscription_details?.subscription;
  if (!customerEmail || !subscriptionId) return;

  const { priceId, currentPeriodEnd } = await getSubscriptionData(
    typeof subscriptionId === "string" ? subscriptionId : subscriptionId.id
  );

  const plan: SubscriptionType = priceId === STRIPE_PRICE_IDS.PLUS ? "PLUS" : "PRO";
  const expirationDate = new Date(currentPeriodEnd * 1000);

  await updateUserSubscription(customerEmail, plan, expirationDate);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.warn(`Payment failed for customer: ${invoice.customer_email}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {  
  const customer = await stripe.customers.retrieve(subscription.customer as string);
  
  if (isCustomer(customer) && customer.email) {
    await updateUserSubscription(customer.email, "FREE", new Date());
  }
}

const eventHandlers: Record<string, (data: unknown) => Promise<void>> = {
  "checkout.session.completed": async (data) => {
    if (isCheckoutSession(data)) {
      await handleCheckoutCompleted(data);
    }
  },
  "invoice.payment_succeeded": async (data) => {
    if (isInvoice(data)) {
      await handleInvoicePaymentSucceeded(data);
    }
  },
  "invoice.payment_failed": async (data) => {
    if (isInvoice(data)) {
      await handleInvoicePaymentFailed(data);
    }
  },
  "customer.subscription.deleted": async (data) => {
    if (isSubscription(data)) {
      await handleSubscriptionDeleted(data);
    }
  },
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    const handler = eventHandlers[event.type];
    
    if (handler) {
      await handler(event.data.object);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { 
        error: "Webhook processing failed",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}