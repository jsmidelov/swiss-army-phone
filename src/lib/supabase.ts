
import { createClient } from '@supabase/supabase-js';
import { App } from './appData';
import { supabase } from '@/integrations/supabase/client';

export async function getApps(): Promise<App[]> {
  try {
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
      businessModel: app.business_model,
      factors: app.factors.map((factor: any) => ({
        name: factor.name,
        description: factor.description,
        present: factor.present
      })),
      lastUpdated: app.last_updated ? new Date(app.last_updated) : undefined
    }));
  } catch (error) {
    console.error('Error in getApps:', error);
    throw error;
  }
}

export async function searchApps(term: string): Promise<App[]> {
  try {
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
      businessModel: app.business_model,
      factors: app.factors.map((factor: any) => ({
        name: factor.name,
        description: factor.description,
        present: factor.present
      })),
      lastUpdated: app.last_updated ? new Date(app.last_updated) : undefined
    }));
  } catch (error) {
    console.error('Error in searchApps:', error);
    throw error;
  }
}
