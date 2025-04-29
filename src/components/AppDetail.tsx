
import React from 'react';
import { App, DrugFactor } from '@/lib/appData';
import DrugScaleIndicator from './DrugScaleIndicator';
import DrugRatingIcon from './DrugRatingIcon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

interface AppDetailProps {
  app: App | null;
  onBack: () => void;
}

const AppDetail: React.FC<AppDetailProps> = ({ app, onBack }) => {
  if (!app) return null;

  const getStoreLabel = (store: string) => {
    switch (store) {
      case 'Apple App Store':
        return 'Available on Apple App Store';
      case 'Google Play':
        return 'Available on Google Play';
      case 'Both':
        return 'Available on Apple App Store & Google Play';
      default:
        return '';
    }
  };

  const renderFactor = (factor: DrugFactor) => {
    return (
      <Card key={factor.name} className="p-4 mb-3 last:mb-0">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3 mt-0.5">
            {factor.present ? (
              <CheckCircle className="h-5 w-5 text-sap-drug" />
            ) : (
              <XCircle className="h-5 w-5 text-sap-tool" />
            )}
          </div>
          <div>
            <h4 className="text-base font-medium mb-1">{factor.name}</h4>
            <p className="text-sm text-gray-600">{factor.description}</p>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack} 
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-shrink-0 md:w-24">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
            {app.icon ? (
              <img 
                src={app.icon} 
                alt={`${app.name} icon`} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="text-4xl">{app.name.charAt(0)}</div>
            )}
          </div>
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold mr-3">{app.name}</h1>
              <DrugRatingIcon rating={app.rating} size="lg" />
            </div>
            <DrugScaleIndicator rating={app.rating} size="lg" />
          </div>
          
          <p className="text-gray-500 mb-2">{app.developer}</p>
          <p className="mb-2">{app.description}</p>
          
          <div className="text-sm text-gray-500 mb-2">
            {getStoreLabel(app.store)}
          </div>

          {app.businessModel && (
            <div className="text-sm font-medium">
              Business Model: <span className="text-gray-700">{app.businessModel}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Digital Wellbeing Factors</h2>
        <p className="text-gray-600 mb-4">
          These factors determine how much an app acts as a useful tool versus a habit-forming dopamine dispenser.
        </p>
        <div>
          {app.factors.map(factor => renderFactor(factor))}
        </div>
      </div>
    </div>
  );
};

export default AppDetail;
