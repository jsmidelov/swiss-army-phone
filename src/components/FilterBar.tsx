import React from 'react';
import { AppStore, DrugRating } from '@/lib/appData';
import { Button } from '@/components/ui/button';

interface FilterBarProps {
  selectedStore: AppStore | 'All';
  selectedRating: DrugRating | 'All';
  onStoreChange: (store: AppStore | 'All') => void;
  onRatingChange: (rating: DrugRating | 'All') => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  selectedStore,
  selectedRating,
  onStoreChange,
  onRatingChange
}) => {
  const stores: (AppStore | 'All')[] = [
    'All',
    'Apple App Store',
    'Google Play',
    'Both'
  ];

  const ratings: (DrugRating | 'All')[] = [
    'All',
    'Tool',
    'Sugar',
    'Coffee',
    'Alcohol',
    'Drug'
  ];

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">App Store</h3>
        <div className="flex flex-wrap gap-2">
          {stores.map((store) => (
            <Button
              key={store}
              variant={selectedStore === store ? "default" : "outline"}
              size="sm"
              onClick={() => onStoreChange(store)}
            >
              {store === 'Apple App Store' ? '🍎 Apple' : 
               store === 'Google Play' ? '🤖 Google' : 
               store === 'Both' ? 'Both' : 'All'}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Tool-to-Drug Scale</h3>
        <div className="flex flex-wrap gap-2">
          {ratings.map((rating) => (
            <Button
              key={rating}
              variant={selectedRating === rating ? "default" : "outline"}
              size="sm"
              onClick={() => onRatingChange(rating)}
            >
              {rating}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
