'use server';

import { supabase } from '../server';
import type { User, SubscriptionType } from '../types';

const HUNDRED_YEARS_IN_MS = 100 * 365 * 24 * 60 * 60 * 1000;

export async function ensureUserExists(email: string): Promise<User> {
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (existingUser) {
    return existingUser;
  }

  const expirationDate = new Date(Date.now() + HUNDRED_YEARS_IN_MS);

  const { data: newUser, error } = await supabase
    .from('users')
    .insert({
      email,
      subscription: 'FREE' as SubscriptionType,
      sub_expiration_date: expirationDate.toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  
  return newUser;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  return data;
}

export async function updateUserSubscription(
  email: string,
  subscription: SubscriptionType,
  expirationDate: Date
): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .update({
      subscription,
      sub_expiration_date: expirationDate.toISOString(),
    })
    .eq('email', email)
    .select()
    .single();

  if (error) throw error;
  
  return data;
}

export async function checkAndUpdateExpiredSubscription(
  email: string
): Promise<void> {
  try {
    const user = await getUserByEmail(email);
    if (!user) return;

    if (user.subscription === "FREE") return;
    
    if (!user.sub_expiration_date) {
      await resetSubscriptionToFree(email);
      return;
    }

    const expirationDate = new Date(user.sub_expiration_date);
    if (isNaN(expirationDate.getTime())) {
      await resetSubscriptionToFree(email);
      return;
    }

    const now = new Date();
    if (now > expirationDate) {
      await resetSubscriptionToFree(email);
    }
  } catch (error) {
    console.error("Error checking subscription, allowing login to proceed:", error);
  }
}

async function resetSubscriptionToFree(email: string): Promise<void> {
  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + 100);

  const { error } = await supabase
    .from("users")
    .update({
      subscription: "FREE",
      sub_expiration_date: futureDate.toISOString(),
    })
    .eq("email", email);

  if (error) {
    throw error;
  }
}