
import React from 'react';
import { DrugRating } from '@/lib/appData';

interface DrugScaleIndicatorProps {
  rating: DrugRating;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const DrugScaleIndicator: React.FC<DrugScaleIndicatorProps> = ({ 
  rating, 
  size = 'md',
  showLabel = true
}) => {
  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  const widths = {
    sm: 'w-20',
    md: 'w-28',
    lg: 'w-36'
  };

  const getOpacity = (segment: number): string => {
    const ratings = ['Tool', 'Mostly Tool', 'Bits of Both', 'Mostly Drug', 'Drug'];
    const currentIndex = ratings.indexOf(rating);
    
    if (segment < currentIndex) return 'opacity-30';
    if (segment === currentIndex) return 'opacity-100';
    if (segment > currentIndex) return 'opacity-30';
    
    return 'opacity-30';
  };

  const getColor = (segment: number): string => {
    if (segment <= 1) return 'bg-sap-tool';
    if (segment === 2) return 'bg-gradient-to-r from-sap-tool to-sap-drug';
    return 'bg-sap-drug';
  };

  return (
    <div className="flex flex-col gap-1">
      <div className={`scale-indicator ${widths[size]} ${heights[size]}`}>
        <div className={`scale-indicator-segment ${getColor(0)} ${getOpacity(0)}`}></div>
        <div className={`scale-indicator-segment ${getColor(1)} ${getOpacity(1)}`}></div>
        <div className={`scale-indicator-segment ${getColor(2)} ${getOpacity(2)}`}></div>
        <div className={`scale-indicator-segment ${getColor(3)} ${getOpacity(3)}`}></div>
        <div className={`scale-indicator-segment ${getColor(4)} ${getOpacity(4)}`}></div>
      </div>
      {showLabel && (
        <div className="text-xs font-medium text-gray-700">{rating}</div>
      )}
    </div>
  );
};

export default DrugScaleIndicator;
