'use server';

import { supabase } from '../server';
import type { 
  BusinessPlan, 
  CreateBusinessPlanInput, 
} from '../types';

export async function createBusinessPlan(
  input: CreateBusinessPlanInput
): Promise<BusinessPlan> {
  const { data, error } = await supabase
    .from('business_plans')
    .insert({
      user_email: input.user_email,
      plan_name: input.plan_name,
      plan: input.plan,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating business plan:', error);
    throw error;
  }
  
  return data;
}

export async function getBusinessPlansByUser(
  userEmail: string
): Promise<BusinessPlan[]> {
  const { data, error } = await supabase
    .from('business_plans')
    .select('*')
    .eq('user_email', userEmail)
    .order('creation_date', { ascending: false });

  if (error) {
    console.error('Error fetching business plans:', error);
    throw error;
  }
  
  return data ?? [];
}

export async function getBusinessPlansByDateRange(
  userEmail: string,
  options?: {
    from?: Date;
    to?: Date;
  }
): Promise<BusinessPlan[]> {
  let query = supabase
    .from('business_plans')
    .select('*')
    .eq('user_email', userEmail);

  if (options?.from) {
    query = query.gte('creation_date', options.from.toISOString());
  }

  if (options?.to) {
    query = query.lte('creation_date', options.to.toISOString());
  }

  const { data, error } = await query.order('creation_date', { ascending: false });

  if (error) {
    console.error('Error fetching business plans by date:', error);
    throw error;
  }

  return data ?? [];
}

export async function deleteBusinessPlan(id: string): Promise<void> {
  const { error } = await supabase
    .from('business_plans')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting business plan:', error);
    throw error;
  }
}

export async function getBusinessPlanCount(userEmail: string): Promise<number> {
  const { count, error } = await supabase
    .from('business_plans')
    .select('*', { count: 'exact', head: true })
    .eq('user_email', userEmail);

  if (error) {
    console.error('Error counting business plans:', error);
    return 0;
  }

  return count ?? 0;
}