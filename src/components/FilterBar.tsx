
import React from 'react';
import { AppStore, DrugRating } from '@/lib/appData';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { SlidersHorizontal } from 'lucide-react';

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

  // Remove "All" from the ratings array for the slider
  const ratings: DrugRating[] = [
    'Tool',
    'Sugar',
    'Coffee',
    'Alcohol',
    'Drug'
  ];

  // Map rating to numeric value for the slider
  const ratingToValue = (rating: DrugRating | 'All'): number => {
    // If "All" is selected, use the highest rating (Drug)
    if (rating === 'All') return ratings.length - 1;
    return ratings.indexOf(rating);
  };

  // Map numeric value back to rating
  const valueToRating = (value: number): DrugRating => {
    return ratings[value];
  };

  const handleSliderChange = (value: number[]) => {
    onRatingChange(valueToRating(value[0]));
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2">
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
              {store === 'Apple App Store' ? '🍎 App Store' : 
               store === 'Google Play' ? '🤖 Google Play' : 
               store === 'Both' ? 'Both' : 'All'}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-700">Maximum Addictiveness Level</h3>
        </div>
        
        <div className="px-2">
          <Slider
            value={[ratingToValue(selectedRating)]}
            max={ratings.length - 1}
            step={1}
            onValueChange={handleSliderChange}
            className="w-full"
          />
          
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            {ratings.map((rating, index) => (
              <div 
                key={rating} 
                className={`flex flex-col items-center ${selectedRating === rating ? "font-medium text-primary" : ""}`}
                style={{ width: `${100 / (ratings.length - 1)}%`, marginLeft: index === 0 ? '0' : '-10px' }}
              >
                <span>{rating}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
