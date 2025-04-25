
import React, { useState, useEffect } from 'react';
import { App, AppStore, DrugRating, sampleApps } from '@/lib/appData';
import AppCard from '@/components/AppCard';
import AppDetail from '@/components/AppDetail';
import SearchBar from '@/components/SearchBar';
import FilterBar from '@/components/FilterBar';

const Index = () => {
  const [apps, setApps] = useState<App[]>(sampleApps);
  const [filteredApps, setFilteredApps] = useState<App[]>(sampleApps);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState<AppStore | 'All'>('All');
  const [selectedRating, setSelectedRating] = useState<DrugRating | 'All'>('All');

  useEffect(() => {
    filterApps();
  }, [searchTerm, selectedStore, selectedRating]);

  const filterApps = () => {
    let results = [...apps];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        app => app.name.toLowerCase().includes(term) || 
               app.description.toLowerCase().includes(term) ||
               app.category.toLowerCase().includes(term) ||
               app.developer.toLowerCase().includes(term)
      );
    }

    // Filter by store
    if (selectedStore !== 'All') {
      results = results.filter(app => app.store === selectedStore);
    }

    // Filter by rating
    if (selectedRating !== 'All') {
      results = results.filter(app => app.rating === selectedRating);
    }

    setFilteredApps(results);
  };

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
          Discover which apps are useful tools and which are designed to be addictive. Rate apps on our tool-to-drug scale to make informed choices about what's on your device.
        </p>
      </header>

      {selectedApp ? (
        <AppDetail app={selectedApp} onBack={handleBackClick} />
      ) : (
        <>
          <div className="mb-8 grid gap-6 sm:grid-cols-2">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            <div className="flex justify-end">
              <p className="text-sm text-gray-500 self-end">
                Showing {filteredApps.length} {filteredApps.length === 1 ? 'app' : 'apps'}
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

          {filteredApps.length > 0 ? (
            <div className="app-grid">
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
