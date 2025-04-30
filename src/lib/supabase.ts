
import { createClient } from '@supabase/supabase-js';
import { App, BusinessModel } from './appData';
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
    throw error;
  }
}

// Add a new app to the database
export async function addApp(app: Omit<App, 'id'|'factors'> & { factors: { name: string, present: boolean }[] }): Promise<App | null> {
  try {
    // First, insert the app
    const { data: insertedApp, error: appError } = await supabase
      .from('apps')
      .insert({
        name: app.name,
        icon: app.icon,
        store: app.store,
        rating: app.rating,
        description: app.description || null,
        category: app.category,
        developer: app.developer,
        business_model: app.businessModel || null,
        last_updated: new Date().toISOString()
      })
      .select()
      .single();

    if (appError) {
      console.error('Error adding app:', appError);
      throw appError;
    }

    // Then, insert the factors
    if (app.factors && app.factors.length > 0) {
      const factorsToInsert = app.factors.map(factor => ({
        app_id: insertedApp.id,
        name: factor.name,
        description: '', // We'll need to get the description from the drugFactors or another source
        present: factor.present
      }));

      const { error: factorsError } = await supabase
        .from('app_factors')
        .insert(factorsToInsert);

      if (factorsError) {
        console.error('Error adding app factors:', factorsError);
        // Consider deleting the app if factors insertion fails
        await supabase.from('apps').delete().eq('id', insertedApp.id);
        throw factorsError;
      }
    }

    // Get the complete app with factors
    return await getAppById(insertedApp.id);
  } catch (error) {
    console.error('Error in addApp:', error);
    throw error;
  }
}

// Get a single app by ID
export async function getAppById(id: string): Promise<App | null> {
  try {
    const { data: app, error } = await supabase
      .from('apps')
      .select(`
        *,
        factors:app_factors(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching app with ID ${id}:`, error);
      throw error;
    }

    if (!app) return null;

    return {
      ...app,
      businessModel: app.business_model as BusinessModel | undefined,
      factors: app.factors.map((factor: any) => ({
        name: factor.name,
        description: factor.description,
        present: factor.present
      })),
      lastUpdated: app.last_updated ? new Date(app.last_updated) : undefined
    };
  } catch (error) {
    console.error('Error in getAppById:', error);
    throw error;
  }
}

// Update an existing app
export async function updateApp(id: string, updates: Partial<Omit<App, 'id'|'factors'>> & { factors?: { name: string, present: boolean }[] }): Promise<App | null> {
  try {
    // First, update the app details
    const appUpdates: any = {
      ...updates,
      business_model: updates.businessModel,
      last_updated: new Date().toISOString()
    };
    
    // Remove transformed fields
    delete appUpdates.businessModel;
    delete appUpdates.factors;
    
    const { error: appError } = await supabase
      .from('apps')
      .update(appUpdates)
      .eq('id', id);

    if (appError) {
      console.error(`Error updating app with ID ${id}:`, appError);
      throw appError;
    }

    // Update factors if provided
    if (updates.factors && updates.factors.length > 0) {
      // First, delete existing factors
      const { error: deleteError } = await supabase
        .from('app_factors')
        .delete()
        .eq('app_id', id);

      if (deleteError) {
        console.error(`Error deleting factors for app ID ${id}:`, deleteError);
        throw deleteError;
      }

      // Then, insert updated factors
      const factorsToInsert = updates.factors.map(factor => ({
        app_id: id,
        name: factor.name,
        description: '', // We'll need to get the description from drugFactors
        present: factor.present
      }));

      const { error: insertError } = await supabase
        .from('app_factors')
        .insert(factorsToInsert);

      if (insertError) {
        console.error(`Error inserting updated factors for app ID ${id}:`, insertError);
        throw insertError;
      }
    }

    // Get the updated app
    return await getAppById(id);
  } catch (error) {
    console.error('Error in updateApp:', error);
    throw error;
  }
}

// Delete an app
export async function deleteApp(id: string): Promise<void> {
  try {
    // Delete factors first (due to foreign key constraint)
    const { error: factorsError } = await supabase
      .from('app_factors')
      .delete()
      .eq('app_id', id);

    if (factorsError) {
      console.error(`Error deleting factors for app ID ${id}:`, factorsError);
      throw factorsError;
    }

    // Then delete the app
    const { error: appError } = await supabase
      .from('apps')
      .delete()
      .eq('id', id);

    if (appError) {
      console.error(`Error deleting app with ID ${id}:`, appError);
      throw appError;
    }
  } catch (error) {
    console.error('Error in deleteApp:', error);
    throw error;
  }
}

// Get all drug factors for reference (name and description)
export async function getAllDrugFactors(): Promise<{ name: string, description: string }[]> {
  try {
    const { data: factors, error } = await supabase
      .from('rating_factors')
      .select('name, description');
    
    if (error) {
      console.error('Error fetching drug factors:', error);
      throw error;
    }
    
    return factors;
  } catch (error) {
    console.error('Error in getAllDrugFactors:', error);
    throw error;
  }
}
