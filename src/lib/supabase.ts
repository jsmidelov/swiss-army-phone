
import { createClient } from '@supabase/supabase-js';
import { App, DrugFactor } from './appData';

// Check if environment variables are defined
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('VITE_SUPABASE_URL is not defined. Please check your environment variables.');
}

if (!supabaseKey) {
  console.error('VITE_SUPABASE_ANON_KEY is not defined. Please check your environment variables.');
}

// Create the Supabase client with error handling
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',  // Fallback URL to prevent immediate crash
  supabaseKey || 'placeholder-key'                      // Fallback key to prevent immediate crash
);

// Check if the connection is valid before allowing operations
const isSupabaseConfigured = !!(supabaseUrl && supabaseKey);

export async function getApps(): Promise<App[]> {
  if (!isSupabaseConfigured) {
    console.error('Supabase is not properly configured. Using sample data instead.');
    // Import and return sample data as fallback
    const { sampleApps } = await import('./appData');
    return sampleApps;
  }

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
      factors: app.factors.map((factor: any) => ({
        name: factor.name,
        description: factor.description,
        present: factor.present
      }))
    }));
  } catch (error) {
    console.error('Error in getApps:', error);
    // Return sample data as fallback on error
    const { sampleApps } = await import('./appData');
    return sampleApps;
  }
}

export async function searchApps(term: string): Promise<App[]> {
  if (!isSupabaseConfigured) {
    console.error('Supabase is not properly configured. Using sample data for search instead.');
    // Import and search in sample data as fallback
    const { sampleApps } = await import('./appData');
    const lowerTerm = term.toLowerCase();
    return sampleApps.filter(app => 
      app.name.toLowerCase().includes(lowerTerm) || 
      app.description.toLowerCase().includes(lowerTerm) || 
      app.category.toLowerCase().includes(lowerTerm) ||
      app.developer.toLowerCase().includes(lowerTerm)
    );
  }

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
      factors: app.factors.map((factor: any) => ({
        name: factor.name,
        description: factor.description,
        present: factor.present
      }))
    }));
  } catch (error) {
    console.error('Error in searchApps:', error);
    // Search in sample data as fallback on error
    const { sampleApps } = await import('./appData');
    const lowerTerm = term.toLowerCase();
    return sampleApps.filter(app => 
      app.name.toLowerCase().includes(lowerTerm) || 
      app.description.toLowerCase().includes(lowerTerm) || 
      app.category.toLowerCase().includes(lowerTerm) ||
      app.developer.toLowerCase().includes(lowerTerm)
    );
  }
}
