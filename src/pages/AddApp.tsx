
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from 'react-hook-form';
import { App, AppStore, BusinessModel, DrugFactor, DrugRating } from '@/lib/appData';
import { addApp, getAllDrugFactors } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FactorSelection extends DrugFactor {
  present: boolean;
}

const AddApp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFactors, setSelectedFactors] = useState<FactorSelection[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: drugFactors = [], isLoading: isFactorsLoading, error: factorsError } = useQuery({
    queryKey: ['drugFactors'],
    queryFn: getAllDrugFactors,
    retry: 1
  });

  useEffect(() => {
    // Initialize selectedFactors with all drugFactors set to present: false
    const initialFactors = drugFactors.map(factor => ({ ...factor, present: false }));
    setSelectedFactors(initialFactors);
  }, [drugFactors]);

  const form = useForm<{
    name: string;
    developer: string;
    category: string;
    description: string;
    icon: string;
    store: AppStore;
    rating: DrugRating;
    businessModel: BusinessModel;
  }>({
    defaultValues: {
      name: '',
      developer: '',
      category: '',
      description: '',
      icon: '',
      store: 'Apple App Store',
      rating: 'Drug',
      businessModel: 'Unknown',
    },
  });

  const handleFactorChange = (factorName: string, isPresent: boolean) => {
    setSelectedFactors(prevFactors => {
      return prevFactors.map(factor => {
        if (factor.name === factorName) {
          return { ...factor, present: isPresent };
        }
        return factor;
      });
    });
  };

  const addNewApp = async () => {
    try {
      setIsLoading(true);
      
      // Ensure factors have required properties
      const formattedFactors = selectedFactors.map(factor => ({
        name: factor.name,
        present: factor.present
      }));
      
      const newApp = {
        name: form.getValues("name"),
        developer: form.getValues("developer"),
        category: form.getValues("category"),
        description: form.getValues("description"),
        icon: form.getValues("icon"),
        store: form.getValues("store"),
        rating: form.getValues("rating"),
        businessModel: form.getValues("businessModel"),
        factors: formattedFactors
      };
      
      await addApp(newApp);
      
      toast({
        title: "Success",
        description: "App added successfully",
      });
      
      // Reset form
      form.reset();
      setSelectedFactors([]);
      
      // Navigate back to home
      navigate('/');
      
      // Refresh apps list
      queryClient.invalidateQueries({ queryKey: ['apps'] });
    } catch (error) {
      console.error('Error adding app:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add app. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        <h1 className="text-2xl font-bold mb-6">Add a new app</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(addNewApp)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name of the app" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="developer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Developer</FormLabel>
                      <FormControl>
                        <Input placeholder="Developer of the app" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="Category of the app" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Description of the app" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon URL</FormLabel>
                      <FormControl>
                        <Input placeholder="URL of the app icon" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="store"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a store" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Apple App Store">Apple App Store</SelectItem>
                          <SelectItem value="Google Play">Google Play</SelectItem>
                          <SelectItem value="Both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a rating" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Tool">Tool</SelectItem>
                          <SelectItem value="Sugar">Sugar</SelectItem>
                          <SelectItem value="Coffee">Coffee</SelectItem>
                          <SelectItem value="Alcohol">Alcohol</SelectItem>
                          <SelectItem value="Drug">Drug</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="businessModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Model</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a business model" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Pay Once">Pay Once</SelectItem>
                          <SelectItem value="Subscription">Subscription</SelectItem>
                          <SelectItem value="Freemium">Freemium</SelectItem>
                          <SelectItem value="Advertising">Advertising</SelectItem>
                          <SelectItem value="In-App Purchases">In-App Purchases</SelectItem>
                          <SelectItem value="Unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Digital Wellbeing Factors</h3>
              <FormDescription className="mb-4">
                Select the factors that apply to this app.
              </FormDescription>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {drugFactors.map((factor) => (
                  <FormField
                    key={factor.name}
                    control={form.control}
                    name={factor.name as any}
                    render={() => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel htmlFor={factor.name} className="text-base">
                            {factor.name}
                          </FormLabel>
                          <FormDescription>
                            {factor.description}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            id={factor.name}
                            checked={selectedFactors.find(f => f.name === factor.name)?.present}
                            onCheckedChange={(checked) => handleFactorChange(factor.name, checked)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-4 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </div>
                ) : "Add App"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddApp;
