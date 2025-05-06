
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { App } from '@/lib/appData';
import DrugRatingIcon from './DrugRatingIcon';
import UpdateAppDialog from './UpdateAppDialog';

interface AppCardProps {
  app: App;
  onClick: () => void;
}

const AppCard = ({ app, onClick }: AppCardProps) => {
  // Check if app is more than 1 month old
  const isAppOutdated = () => {
    if (!app.lastUpdated) return true;
    const lastUpdated = new Date(app.lastUpdated);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return lastUpdated < oneMonthAgo;
  };

  return (
    <Card className="transition-shadow hover:shadow-lg cursor-pointer group overflow-hidden" onClick={onClick}>
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100 flex-shrink-0">
            {app.icon ? (
              <img src={app.icon} alt={`${app.name} icon`} className="w-full h-full object-cover" />
            ) : (
              <div className="text-gray-400 text-xs text-center w-full">No icon</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-base text-gray-900 truncate group-hover:text-blue-600">{app.name}</h3>
            <p className="text-xs text-gray-500 truncate">{app.developer}</p>
          </div>
          <div className="flex items-center">
            <DrugRatingIcon rating={app.rating} size="lg" />
          </div>
        </div>
        
        <CardContent className="flex-1 p-0">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-gray-500">{app.category}</div>
            <div className="text-xs text-gray-400">{
              app.store === 'Apple App Store' ? '🍎 App Store' : 
              app.store === 'Google Play' ? '🤖 Google Play' : 
              app.store === 'Both' ? 'Both' : 'All'}
            </div>
          </div>
          
          <div className="h-12 overflow-hidden">
            {app.description ? (
              <p className="text-xs text-gray-600 line-clamp-3">{app.description}</p>
            ) : (
              <p className="text-xs text-gray-400 italic">No description available</p>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-4 pb-0 px-0 mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <UpdateAppDialog app={app} />
            </div>
          {isAppOutdated() && (
            <div className="text-xs text-amber-600 mt-2 flex items-center">
              Data may be outdated
            </div>
          )}
        </CardFooter>
      </div>
    </Card>
  );
};

export default AppCard;
