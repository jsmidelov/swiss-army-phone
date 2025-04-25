
import React from 'react';
import { App } from '@/lib/appData';
import DrugScaleIndicator from './DrugScaleIndicator';
import { Card } from '@/components/ui/card';

interface AppCardProps {
  app: App;
  onClick: () => void;
}

const AppCard: React.FC<AppCardProps> = ({ app, onClick }) => {
  const getStoreIcon = (store: string) => {
    switch (store) {
      case 'Apple App Store':
        return '🍎';
      case 'Google Play':
        return '🤖';
      case 'Both':
        return '🍎 🤖';
      default:
        return '';
    }
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all hover:shadow-md"
      onClick={onClick}
    >
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
            {app.icon ? (
              <img 
                src={app.icon} 
                alt={`${app.name} icon`} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-2xl">{app.name.charAt(0)}</div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-base font-medium leading-tight truncate">{app.name}</h3>
            <p className="text-xs text-gray-500 truncate">{app.category}</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-auto pt-2">
          <div className="text-sm text-gray-500">
            <span title={app.store}>{getStoreIcon(app.store)}</span>
          </div>
          <DrugScaleIndicator rating={app.rating} size="sm" />
        </div>
      </div>
    </Card>
  );
};

export default AppCard;
