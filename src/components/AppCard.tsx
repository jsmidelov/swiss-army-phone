
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { App } from '@/lib/appData';
import DrugRatingIcon from './DrugRatingIcon';

interface AppCardProps {
  app: App;
  onClick: () => void;
}

const AppCard = ({ app, onClick }: AppCardProps) => {
  return (
    <button className="transition-shadow hover:shadow-lg cursor-pointer group overflow-hidden" onClick={onClick}>
      <Card className="p-4 flex flex-col h-full">
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
            <p className="text-xs text-gray-500 truncate">{app.rating}</p>
          </div>
          <div className="flex items-center">
            <DrugRatingIcon rating={app.rating} size="lg" />
          </div>
        </div>
        
        <CardContent className="flex-1 p-0">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-gray-500">{app.developer}</div>
            <div className="text-xs text-gray-500">{app.category}</div>
            <div className="text-xs text-gray-400">{
              app.store === 'Apple App Store' ? '🍎' : 
              app.store === 'Google Play' ? '🤖' : 
              app.store === 'Both' ? '🍎🤖' : ''}
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
      </Card>
    </button>
  );
};

export default AppCard;
