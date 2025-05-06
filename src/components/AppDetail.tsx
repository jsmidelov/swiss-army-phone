
import React from 'react';
import { App } from '@/lib/appData';
import { Button } from './ui/button';
import DrugScaleIndicator from './DrugScaleIndicator';
import DrugRatingIcon from './DrugRatingIcon';
import { ArrowLeft, Check, X } from 'lucide-react';
import UpdateAppDialog from './UpdateAppDialog';
import BusinessModelInfo from './BusinessModelInfo';

interface AppDetailProps {
  app: App;
  onBack: () => void;
}

const AppDetail = ({ app, onBack }: AppDetailProps) => {
  // Check if app is more than 1 month old
  const isAppOutdated = () => {
    if (!app.lastUpdated) return true;
    const lastUpdated = new Date(app.lastUpdated);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return lastUpdated < oneMonthAgo;
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Unknown';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex flex-col md:flex-row justify-between">
        <Button
          variant="outline"
          size="sm"
          className="mb-4 md:mb-0 self-start"
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to apps
        </Button>
        
        <div className="flex items-center gap-2 self-start">
          {isAppOutdated() && (
            <div className="text-sm text-amber-600 flex items-center">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-500 mr-1"></span>
              Data may be outdated ({formatDate(app.lastUpdated)})
            </div>
          )}
          
          <div onClick={(e) => e.stopPropagation()}>
            <UpdateAppDialog app={app} />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-start gap-6 mt-6">
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 mb-2">
            {app.icon ? (
              <img src={app.icon} alt={`${app.name} icon`} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No icon</div>
            )}
          </div>
          
          <div className="flex flex-col items-center">
            <DrugRatingIcon rating={app.rating} size="large" />
            <span className="mt-1 font-bold text-lg">{app.rating}</span>
          </div>
        </div>
        
        <div className="flex-grow">
          <h1 className="text-2xl font-bold mb-1">{app.name}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600 mb-4">
            <span>By {app.developer}</span>
            <span>Category: {app.category}</span>
            <span>Available on: {app.store}</span>
          </div>
          
          {app.description ? (
            <p className="text-gray-700 mb-6">{app.description}</p>
          ) : (
            <p className="text-gray-500 italic mb-6">No description available</p>
          )}
          
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-3">Rating on the Tool-to-Drug Scale</h3>
            <DrugScaleIndicator rating={app.rating} />
          </div>
          
          {app.businessModel && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Business Model</h3>
              <BusinessModelInfo businessModel={app.businessModel} />
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-medium mb-2">Digital Wellbeing Factors</h3>
            <p className="text-sm text-gray-600 mb-4">
              These are specific features and design elements that may impact your digital wellbeing:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {app.factors.map((factor) => (
                <div key={factor.name} className="flex items-start">
                  <div className={`flex-shrink-0 mt-0.5 rounded-full p-1 ${factor.present ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {factor.present ? (
                      <X className="h-3 w-3" />
                    ) : (
                      <Check className="h-3 w-3" />
                    )}
                  </div>
                  <div className="ml-2">
                    <h4 className="text-sm font-medium">{factor.name}</h4>
                    <p className="text-xs text-gray-600">{factor.description}</p>
                  </div>
                </div>
              ))}
              
              {app.businessModel && app.businessModel !== 'Unknown' && (
                <div className="flex items-start">
                  <div className={`flex-shrink-0 mt-0.5 rounded-full p-1 ${app.businessModel === 'Pay Once' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {app.businessModel === 'Pay Once' ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                  </div>
                  <div className="ml-2">
                    <h4 className="text-sm font-medium">Business Model: {app.businessModel}</h4>
                    <p className="text-xs text-gray-600">
                      {app.businessModel === 'Advertising' && "App makes money by showing ads, incentivizing longer usage times to increase ad impressions."}
                      {app.businessModel === 'In-App Purchases' && "App uses psychological triggers to encourage impulse purchases."}
                      {app.businessModel === 'Freemium' && "App offers free basic features but uses engagement tactics to convert users to paying customers."}
                      {app.businessModel === 'Subscription' && "App employs moderate engagement tactics to ensure you renew your subscription."}
                      {app.businessModel === 'Pay Once' && "Pay once upfront model typically has fewer addictive design elements."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDetail;
