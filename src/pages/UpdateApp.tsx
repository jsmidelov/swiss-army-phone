
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { App, AppStore, DrugRating, BusinessModel, DrugFactor } from '@/lib/appData';
import { getAllDrugFactors, updateApp, getAppById } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Check, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateApp = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    developer: '',
    category: '',
    description: '',
    icon: '',
    store: 'Apple App Store' as AppStore,
    rating: 'Drug' as DrugRating,
    businessModel: 'Unknown' as BusinessModel,
  });
  const [selectedFactors, setSelectedFactors] = useState<DrugFactor[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch app details
  const { data: app, isLoading: isAppLoading, error: appError } = useQuery({
    queryKey: ['app', id],
    queryFn: () => id ? getAppById(id) : null,
    enabled: !!id,
  });

  // Fetch all factors
  const { data: allFactors, error: factorsError } = useQuery({
    queryKey: ['allDrugFactors'],
    queryFn: getAllDrugFactors,
    initialData: [],
  });

  useEffect(() => {
    if (app) {
      setFormData({
        name: app.name,
        developer: app.developer,
        category: app.category,
        description: app.description || '',
        icon: app.icon || '',
        store: app.store,
        rating: app.rating,
        businessModel: app.businessModel || 'Unknown',
      });
      setSelectedFactors(app.factors);
    }
  }, [app]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleFactor = (factorName: string) => {
    setSelectedFactors(prevFactors => {
      const factorIndex = prevFactors.findIndex(factor => factor.name === factorName);
      if (factorIndex > -1) {
        // Factor exists, toggle 'present' status
        const updatedFactors = [...prevFactors];
        updatedFactors[factorIndex] = {
          ...updatedFactors[factorIndex],
          present: !updatedFactors[factorIndex].present,
        };
        return updatedFactors;
      } else {
        // Factor doesn't exist, add it with 'present' as true
        const factorToAdd = allFactors.find(factor => factor.name === factorName);
        if (factorToAdd) {
          return [...prevFactors, { ...factorToAdd, present: true }];
        }
        return prevFactors;
      }
    });
  };

  const isFactorPresent = (factorName: string): boolean => {
    const factor = selectedFactors.find(factor => factor.name === factorName);
    return factor ? factor.present : false;
  };

  const updateAppData = async () => {
    if (!id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "App ID is missing. Cannot update.",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Ensure factors have required properties
      const formattedFactors = selectedFactors.map(factor => ({
        name: factor.name,
        present: factor.present
      }));
      
      const updatedApp = {
        name: formData.name,
        developer: formData.developer,
        category: formData.category,
        description: formData.description,
        icon: formData.icon,
        store: formData.store,
        rating: formData.rating,
        businessModel: formData.businessModel,
        factors: formattedFactors
      };
      
      await updateApp(id, updatedApp);
      
      toast({
        title: "Success",
        description: "App updated successfully",
      });
      
      navigate('/');
      
      // Refresh apps list
      queryClient.invalidateQueries({ queryKey: ['apps'] });
    } catch (error) {
      console.error('Error updating app:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update app. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isAppLoading) {
    return (
      <div className="container max-w-screen-xl py-8 px-4 sm:px-6 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  if (appError || !app) {
    return (
      <div className="container max-w-screen-xl py-8 px-4 sm:px-6">
        <div className="bg-red-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading App</h2>
          <p className="text-red-600">Unable to load app details. Please try again later.</p>
          <Button className="mt-4" onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl py-8 px-4 sm:px-6">
      <Button
        variant="outline"
        size="sm"
        className="mb-6"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to apps
      </Button>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Update {app.name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="developer">Developer</Label>
              <Input 
                type="text" 
                id="developer" 
                name="developer" 
                value={formData.developer} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input 
                type="text" 
                id="category" 
                name="category" 
                value={formData.category} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="icon">Icon URL</Label>
              <Input 
                type="text" 
                id="icon" 
                name="icon" 
                value={formData.icon} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="store">Store</Label>
              <Select 
                onValueChange={(value) => handleSelectChange('store', value)} 
                value={formData.store}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select store" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Apple App Store">Apple App Store</SelectItem>
                  <SelectItem value="Google Play">Google Play</SelectItem>
                  <SelectItem value="Both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="rating">Rating</Label>
              <Select 
                onValueChange={(value) => handleSelectChange('rating', value)} 
                value={formData.rating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tool">Tool</SelectItem>
                  <SelectItem value="Sugar">Sugar</SelectItem>
                  <SelectItem value="Coffee">Coffee</SelectItem>
                  <SelectItem value="Alcohol">Alcohol</SelectItem>
                  <SelectItem value="Drug">Drug</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="businessModel">Business Model</Label>
              <Select 
                onValueChange={(value) => handleSelectChange('businessModel', value)} 
                value={formData.businessModel}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pay Once">Pay Once</SelectItem>
                  <SelectItem value="Subscription">Subscription</SelectItem>
                  <SelectItem value="Freemium">Freemium</SelectItem>
                  <SelectItem value="Advertising">Advertising</SelectItem>
                  <SelectItem value="In-App Purchases">In-App Purchases</SelectItem>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-2">Digital Wellbeing Factors</h3>
          <p className="text-sm text-gray-600 mb-4">
            Toggle the factors that apply to this app:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allFactors.map((factor) => (
              <div key={factor.name} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h4 className="text-sm font-medium">{factor.name}</h4>
                  <p className="text-xs text-gray-600">{factor.description}</p>
                </div>
                <Switch 
                  id={factor.name} 
                  checked={isFactorPresent(factor.name)} 
                  onCheckedChange={() => toggleFactor(factor.name)} 
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-4 mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
          <Button 
            onClick={updateAppData} 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </div>
            ) : "Update"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpdateApp;
