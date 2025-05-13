
import React, { useState } from 'react';
import { App, AppStore, DrugRating } from '@/lib/appData';
import AppCard from '@/components/AppCard';
import AppDetail from '@/components/AppDetail';
import SearchBar from '@/components/SearchBar';
import FilterBar from '@/components/FilterBar';
import { useQuery } from '@tanstack/react-query';
import { getApps, searchApps } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import AddAppDialog from '@/components/AddAppDialog';

const Index = () => {
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState<AppStore | 'All'>('All');
  const [selectedRating, setSelectedRating] = useState<DrugRating>('Drug');
  const { toast } = useToast();

  const { 
    data: apps = [], 
    isLoading, 
    error,
    isError 
  } = useQuery({
    queryKey: ['apps', searchTerm],
    queryFn: () => searchTerm ? searchApps(searchTerm) : getApps(),
    retry: 1,
    meta: {
      onError: (err: any) => {
        console.error('Query error:', err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load apps. Please try again later.",
        });
      }
    }
  });

  // Get the numeric value of the selected rating for comparison
  const getRatingValue = (rating: DrugRating): number => {
    const ratings: DrugRating[] = ['Tool', 'Sugar', 'Coffee', 'Alcohol', 'Drug'];
    return ratings.indexOf(rating);
  };

  // Get the numeric value of the selected rating
  const selectedRatingValue = getRatingValue(selectedRating);

  const filteredApps = apps.filter(app => {
    // Filter by store if not "All"
    if (selectedStore !== 'All' && app.store !== selectedStore) return false;
    
    // Filter apps with higher rating value than selected
    const appRatingValue = getRatingValue(app.rating as DrugRating);
    if (appRatingValue > selectedRatingValue) return false;
    
    return true;
  });

  const handleAppClick = (app: App) => {
    setSelectedApp(app);
    window.scrollTo(0, 0);
  };

  const handleBackClick = () => {
    setSelectedApp(null);
  };

  return (
    <div className="container max-w-screen-xl py-8 px-4 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-sap-dark mb-2 flex items-center gap-2">
          <span className="text-sap-tool">Swiss</span> Army <span className="text-sap-drug">Phone</span>
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Your devices offers apps for all kinds of things, but many apps use you more than you use them. Discover how much your apps are designed to hook you, and turn your doom scroller into a digital swiss army knife.
        </p>
      </header>

      {selectedApp ? (
        <AppDetail app={selectedApp} onBack={handleBackClick} />
      ) : (
        <>
          <div className="mb-8 grid gap-6 sm:grid-cols-2">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            <div className="flex justify-between items-center">
              <AddAppDialog />
              <p className="text-sm text-gray-500 self-end">
                {isLoading ? 'Loading...' : `Showing ${filteredApps.length} ${filteredApps.length === 1 ? 'app' : 'apps'}`}
              </p>
            </div>
            <div className="sm:col-span-2">
              <FilterBar 
                selectedStore={selectedStore}
                selectedRating={selectedRating}
                onStoreChange={setSelectedStore}
                onRatingChange={setSelectedRating}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-900">Loading apps...</h3>
            </div>
          ) : isError ? (
            <div className="text-center py-12 bg-red-50 rounded-lg p-6">
              <h3 className="text-xl font-medium text-red-800 mb-2">Failed to load apps</h3>
              <p className="text-red-600">{error instanceof Error ? error.message : 'There was an error connecting to the database. Please try again later.'}</p>
              <button 
                className="mt-4 px-4 py-2 bg-white border border-red-300 rounded-md text-red-700 hover:bg-red-50"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : filteredApps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredApps.map((app) => (
                <AppCard key={app.id} app={app} onClick={() => handleAppClick(app)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-900">No apps found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Index;
