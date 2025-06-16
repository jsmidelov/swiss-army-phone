
import React from 'react';
import { DrugRating } from '@/lib/appData';
import { Hammer, Lollipop, Coffee, Wine, Cigarette } from 'lucide-react';

interface DrugRatingIconProps {
  rating: DrugRating;
  size?: 'sm' | 'md' | 'lg';
}

const DrugRatingIcon: React.FC<DrugRatingIconProps> = ({ 
  rating, 
  size = 'md' 
}) => {
  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32
  };

  const iconProps = {
    size: iconSizes[size],
    className: "inline-block"
  };

  switch (rating) {
    case 'Tool':
      return <Hammer {...iconProps} className={`${iconProps.className} text-sap-tool`} />;
    case 'Sugar':
      return <Lollipop {...iconProps} className={`${iconProps.className} text-pink-400`} />;
    case 'Coffee':
      return <Coffee {...iconProps} className={`${iconProps.className} text-amber-700`} />;
    case 'Alcohol':
      return <Wine {...iconProps} className={`${iconProps.className} text-purple-700`} />;
    case 'Drug':
      return <Cigarette {...iconProps} className={`${iconProps.className} text-sap-drug`} />;
    default:
      return null;
  }
};

export default DrugRatingIcon;
