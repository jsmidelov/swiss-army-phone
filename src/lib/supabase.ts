
import { createClient } from '@supabase/supabase-js';
import { App, BusinessModel } from './appData';
import { supabase } from '@/integrations/supabase/client';

export async function getApps(): Promise<App[]> {
  try {
    // First get all apps
    const { data: apps, error } = await supabase
      .from('apps')
      .select('*');

    if (error) {
      console.error('Error fetching apps:', error);
      throw error;
    }

    // For each app, get its factors
    const appsWithFactors = await Promise.all(apps.map(async (app) => {
      const { data: factorData, error: factorError } = await supabase
        .from('apps_rating_factors')
        .select(`
          rating_id,
          is_present,
          rating_factors(name, description)
        `)
        .eq('app_id', app.id);

      if (factorError) {
        console.error(`Error fetching factors for app ${app.id}:`, factorError);
        return {
          ...app,
          businessModel: app.business_model as BusinessModel | undefined,
          factors: [],
          lastUpdated: app.last_updated ? new Date(app.last_updated) : undefined
        };
      }

      const factors = factorData.map(factor => ({
        name: factor.rating_factors.name,
        description: factor.rating_factors.description,
        present: factor.is_present
      }));

      return {
        ...app,
        businessModel: app.business_model as BusinessModel | undefined,
        factors,
        lastUpdated: app.last_updated ? new Date(app.last_updated) : undefined
      };
    }));

    return appsWithFactors;
  } catch (error) {
    console.error('Error in getApps:', error);
    throw error;
  }
}

export async function searchApps(term: string): Promise<App[]> {
  try {
    // First get all matching apps
    const { data: apps, error } = await supabase
      .from('apps')
      .select('*')
      .ilike('name', `%${term}%`)
      .or(`description.ilike.%${term}%,category.ilike.%${term}%,developer.ilike.%${term}%`);

    if (error) {
      console.error('Error searching apps:', error);
      throw error;
    }

    // For each app, get its factors
    const appsWithFactors = await Promise.all(apps.map(async (app) => {
      const { data: factorData, error: factorError } = await supabase
        .from('apps_rating_factors')
        .select(`
          rating_id,
          is_present,
          rating_factors(name, description)
        `)
        .eq('app_id', app.id);

      if (factorError) {
        console.error(`Error fetching factors for app ${app.id}:`, factorError);
        return {
          ...app,
          businessModel: app.business_model as BusinessModel | undefined,
          factors: [],
          lastUpdated: app.last_updated ? new Date(app.last_updated) : undefined
        };
      }

      const factors = factorData.map(factor => ({
        name: factor.rating_factors.name,
        description: factor.rating_factors.description,
        present: factor.is_present
      }));

      return {
        ...app,
        businessModel: app.business_model as BusinessModel | undefined,
        factors,
        lastUpdated: app.last_updated ? new Date(app.last_updated) : undefined
      };
    }));

    return appsWithFactors;
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
      // First, get the rating factor IDs
      const { data: ratingFactors, error: ratingError } = await supabase
        .from('rating_factors')
        .select('id, name');
      
      if (ratingError) {
        console.error('Error fetching rating factors:', ratingError);
        throw ratingError;
      }
      
      // Create a map of factor name to ID
      const factorNameToId = ratingFactors.reduce((map, factor) => {
        map[factor.name] = factor.id;
        return map;
      }, {} as Record<string, string>);
      
      // Create the insert data for apps_rating_factors
      const factorsToInsert = app.factors
        .filter(factor => factorNameToId[factor.name]) // Only include factors that exist in the DB
        .map(factor => ({
          app_id: insertedApp.id,
          rating_id: factorNameToId[factor.name],
          is_present: factor.present
        }));

      if (factorsToInsert.length > 0) {
        const { error: factorsError } = await supabase
          .from('apps_rating_factors')
          .insert(factorsToInsert);

        if (factorsError) {
          console.error('Error adding app factors:', factorsError);
          // Consider deleting the app if factors insertion fails
          await supabase.from('apps').delete().eq('id', insertedApp.id);
          throw factorsError;
        }
      }
    }

    // Get the complete app with factors
    return await getAppById(insertedApp.id);
  } catch (error) {
    console.error('Error in addApp:', error);
    throw error;
  }
}

// Get a single app by ID using the database function
export async function getAppById(id: string): Promise<App | null> {
  try {
    // Use the database function to get app details with factors
    const { data, error } = await supabase
      .rpc('get_app_details_by_id', {
        app_id: id
      });

    if (error) {
      console.error(`Error fetching app with ID ${id}:`, error);
      throw error;
    }

    if (!data || data.length === 0) return null;
    
    // Process the first row from the app details
    const appData = data[0];
    
    // Transform the data to match the App interface
    const app: App = {
      id: appData.id,
      name: appData.name,
      icon: appData.icon,
      store: appData.store,
      rating: appData.rating,
      description: appData.description,
      category: appData.category,
      developer: appData.developer,
      businessModel: appData.businessmodel,
      factors: appData.factors || [],
      lastUpdated: undefined // We'll need to add this field to our function if needed
    };

    return app;
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
      // First, get the rating factor IDs
      const { data: ratingFactors, error: ratingError } = await supabase
        .from('rating_factors')
        .select('id, name');
      
      if (ratingError) {
        console.error('Error fetching rating factors:', ratingError);
        throw ratingError;
      }
      
      // Create a map of factor name to ID
      const factorNameToId = ratingFactors.reduce((map, factor) => {
        map[factor.name] = factor.id;
        return map;
      }, {} as Record<string, string>);
      
      // First, delete existing factors
      const { error: deleteError } = await supabase
        .from('apps_rating_factors')
        .delete()
        .eq('app_id', id);

      if (deleteError) {
        console.error(`Error deleting factors for app ID ${id}:`, deleteError);
        throw deleteError;
      }

      // Then, insert updated factors
      const factorsToInsert = updates.factors
        .filter(factor => factorNameToId[factor.name]) // Only include factors that exist in the DB
        .map(factor => ({
          app_id: id,
          rating_id: factorNameToId[factor.name],
          is_present: factor.present
        }));

      if (factorsToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('apps_rating_factors')
          .insert(factorsToInsert);

        if (insertError) {
          console.error(`Error inserting updated factors for app ID ${id}:`, insertError);
          throw insertError;
        }
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
      .from('apps_rating_factors')
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
