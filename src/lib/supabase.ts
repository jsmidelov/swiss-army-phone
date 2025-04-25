
import { createClient } from '@supabase/supabase-js';
import { App, DrugFactor } from './appData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getApps(): Promise<App[]> {
  const { data: apps, error } = await supabase
    .from('apps')
    .select(`
      *,
      factors:app_factors(*)
    `);

  if (error) {
    console.error('Error fetching apps:', error);
    throw error;
  }

  return apps.map(app => ({
    ...app,
    factors: app.factors.map((factor: any) => ({
      name: factor.name,
      description: factor.description,
      present: factor.present
    }))
  }));
}

export async function searchApps(term: string): Promise<App[]> {
  const { data: apps, error } = await supabase
    .from('apps')
    .select(`
      *,
      factors:app_factors(*)
    `)
    .ilike('name', `%${term}%`)
    .or(`description.ilike.%${term}%,category.ilike.%${term}%,developer.ilike.%${term}%`);

  if (error) {
    console.error('Error searching apps:', error);
    throw error;
  }

  return apps.map(app => ({
    ...app,
    factors: app.factors.map((factor: any) => ({
      name: factor.name,
      description: factor.description,
      present: factor.present
    }))
  }));
}

