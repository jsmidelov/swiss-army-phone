
import React from 'react';
import { BusinessModel } from '@/lib/appData';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface BusinessModelInfoProps {
  businessModel?: BusinessModel;
}

const BusinessModelInfo = ({ businessModel }: BusinessModelInfoProps) => {
  if (!businessModel) return null;
  
  // Define the business model information
  const getBusinessModelInfo = () => {
    switch (businessModel) {
      case 'Pay Once':
        return {
          risk: 'Low',
          description: 'You pay once upfront and own the app. These apps typically have fewer addictive design elements since they don't need to maximize engagement after purchase.'
        };
      case 'Subscription':
        return {
          risk: 'Medium',
          description: 'You pay periodically for continued access. These apps may employ moderate engagement tactics to ensure you renew your subscription.'
        };
      case 'Freemium':
        return {
          risk: 'Medium-High',
          description: 'Basic features are free, but premium features cost money. These apps often use engagement tactics to convert free users to paying customers.'
        };
      case 'Advertising':
        return {
          risk: 'High',
          description: 'These apps make money by showing you ads. They're incentivized to maximize your screen time and engagement to show more ads.'
        };
      case 'In-App Purchases':
        return {
          risk: 'High',
          description: 'These apps make money when you make purchases inside the app. They often use psychological tactics to encourage impulse purchases.'
        };
      default:
        return {
          risk: 'Unknown',
          description: 'The business model for this app is not known or doesn't fit standard categories.'
        };
    }
  };
  
  const info = getBusinessModelInfo();
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{businessModel}</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="cursor-help">
            <Info className="h-4 w-4 text-gray-500" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div>
              <p className="font-medium">Risk level: <span className="font-normal">{info.risk}</span></p>
              <p className="text-sm mt-1">{info.description}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default BusinessModelInfo;
