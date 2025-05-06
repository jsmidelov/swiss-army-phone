
export type AppStore = 'Apple App Store' | 'Google Play' | 'Both';

export type DrugRating = 
  | 'Tool' 
  | 'Sugar'
  | 'Coffee'
  | 'Alcohol'
  | 'Drug';

export type BusinessModel =
  | 'Pay Once'
  | 'Subscription'
  | 'Freemium'
  | 'Advertising'
  | 'In-App Purchases'
  | 'Unknown';

export interface DrugFactor {
  name: string;
  description: string;
  present: boolean;
}

export interface App {
  id: string;
  name: string;
  icon: string;
  store: AppStore;
  rating: DrugRating;
  description: string;
  category: string;
  developer: string;
  businessModel?: BusinessModel;
  factors: DrugFactor[];
  lastUpdated?: Date;
}
