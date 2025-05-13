import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { App, AppStore, DrugRating, BusinessModel, DrugFactor } from '@/lib/appData';
import { getAllDrugFactors, updateApp } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast"
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, X } from 'lucide-react';

interface UpdateAppDialogProps {
  app: App;
}

const UpdateAppDialog = ({ app }: UpdateAppDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: app.name,
    developer: app.developer,
    category: app.category,
    description: app.description,
    icon: app.icon,
    store: app.store,
    rating: app.rating,
    businessModel: app.businessModel || 'Unknown',
  });
  const [selectedFactors, setSelectedFactors] = useState<DrugFactor[]>(app.factors);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: allFactors, error } = useQuery({
    queryKey: ['allDrugFactors'],
    queryFn: getAllDrugFactors,
    initialData: [],
  });

  useEffect(() => {
    setFormData({
      name: app.name,
      developer: app.developer,
      category: app.category,
      description: app.description,
      icon: app.icon,
      store: app.store,
      rating: app.rating,
      businessModel: app.businessModel || 'Unknown',
    });
    setSelectedFactors(app.factors);
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

  // Update the updateAppData function to ensure the factors have the required shape
  const updateAppData = async () => {
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
      
      await updateApp(app.id, updatedApp);
      
      toast({
        title: "Success",
        description: "App updated successfully",
      });
      
      setOpen(false);
      
      // Refresh apps list
      queryClient.invalidateQueries(['apps']);
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

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          Update App
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update {app.name}</AlertDialogTitle>
          <AlertDialogDescription>
            Make changes to the app details.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="developer" className="text-right">
              Developer
            </Label>
            <Input type="text" id="developer" name="developer" value={formData.developer} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input type="text" id="category" name="category" value={formData.category} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="icon" className="text-right">
              Icon URL
            </Label>
            <Input type="text" id="icon" name="icon" value={formData.icon} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="store" className="text-right">
              Store
            </Label>
            <Select onValueChange={(value) => handleSelectChange('store', value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select store" defaultValue={formData.store} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Apple App Store">Apple App Store</SelectItem>
                <SelectItem value="Google Play">Google Play</SelectItem>
                <SelectItem value="Both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rating" className="text-right">
              Rating
            </Label>
            <Select onValueChange={(value) => handleSelectChange('rating', value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select rating" defaultValue={formData.rating} />
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="businessModel" className="text-right">
              Business Model
            </Label>
            <Select onValueChange={(value) => handleSelectChange('businessModel', value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select business model" defaultValue={formData.businessModel} />
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
          <div>
            <h3>Digital Wellbeing Factors</h3>
            <p className="text-sm text-gray-600 mb-4">
              Toggle the factors that apply to this app:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {allFactors.map((factor) => (
                <div key={factor.name} className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">{factor.name}</h4>
                    <p className="text-xs text-gray-600">{factor.description}</p>
                  </div>
                  <Switch id={factor.name} checked={isFactorPresent(factor.name)} onCheckedChange={() => toggleFactor(factor.name)} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={updateAppData} disabled={isLoading}>
            {isLoading ? (
              <>
                Updating...
                <svg className="animate-spin h-5 w-5 ml-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </>
            ) : "Update"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpdateAppDialog;
