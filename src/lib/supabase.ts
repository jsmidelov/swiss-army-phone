
import { createClient } from '@supabase/supabase-js';
import { App, BusinessModel, sampleApps } from './appData';
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
      // Fallback to sample apps when there's an error
      console.log('Falling back to sample apps data');
      return sampleApps;
    }

    return apps.map(app => ({
      ...app,
      businessModel: app.business_model as BusinessModel | undefined,
      factors: app.factors.map((factor: any) => ({
        name: factor.name,
        description: factor.description,
        present: factor.present
      })),
      lastUpdated: app.last_updated ? new Date(app.last_updated) : undefined
    }));
  } catch (error) {
    console.error('Error in getApps:', error);
    // Fallback to sample apps when there's an exception
    console.log('Falling back to sample apps data due to exception');
    return sampleApps;
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
      // Fallback to filtered sample apps when there's an error
      console.log('Falling back to filtered sample apps data');
      return sampleApps.filter(app => 
        app.name.toLowerCase().includes(term.toLowerCase()) ||
        app.description?.toLowerCase().includes(term.toLowerCase()) ||
        app.category.toLowerCase().includes(term.toLowerCase()) ||
        app.developer.toLowerCase().includes(term.toLowerCase())
      );
    }

    return apps.map(app => ({
      ...app,
      businessModel: app.business_model as BusinessModel | undefined,
      factors: app.factors.map((factor: any) => ({
        name: factor.name,
        description: factor.description,
        present: factor.present
      })),
      lastUpdated: app.last_updated ? new Date(app.last_updated) : undefined
    }));
  } catch (error) {
    console.error('Error in searchApps:', error);
    // Fallback to filtered sample apps when there's an exception
    console.log('Falling back to filtered sample apps data due to exception');
    return sampleApps.filter(app => 
      app.name.toLowerCase().includes(term.toLowerCase()) ||
      app.description?.toLowerCase().includes(term.toLowerCase()) ||
      app.category.toLowerCase().includes(term.toLowerCase()) ||
      app.developer.toLowerCase().includes(term.toLowerCase())
    );
  }
}
