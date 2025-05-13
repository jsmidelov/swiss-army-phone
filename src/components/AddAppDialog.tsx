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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"

interface FactorSelection extends DrugFactor {
  present: boolean;
}

const AddAppDialog = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFactors, setSelectedFactors] = useState<FactorSelection[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const onSubmit = (values: any) => {
    console.log(values);
  }

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
        name: form.getValue("name"),
        developer: form.getValue("developer"),
        category: form.getValue("category"),
        description: form.getValue("description"),
        icon: form.getValue("icon"),
        store: form.getValue("store"),
        rating: form.getValue("rating"),
        businessModel: form.getValue("businessModel"),
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
      setOpen(false);
      
      // Refresh apps list
      queryClient.invalidateQueries(['apps']);
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

  const formData = {
    name: form.watch("name"),
    developer: form.watch("developer"),
    category: form.watch("category"),
    description: form.watch("description"),
    icon: form.watch("icon"),
    store: form.watch("store"),
    rating: form.watch("rating"),
    businessModel: form.watch("businessModel"),
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Add App</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add a new app</AlertDialogTitle>
          <AlertDialogDescription>
            Fill in the information below to add a new app to the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <div>
              <FormLabel>Digital Wellbeing Factors</FormLabel>
              <FormDescription>
                Select the factors that apply to this app.
              </FormDescription>
              <div className="grid gap-2 mt-4">
                {drugFactors.map((factor) => (
                  <FormField
                    key={factor.name}
                    control={form.control}
                    name={factor.name}
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
          </form>
        </Form>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={addNewApp} disabled={isLoading}>
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : null}
            Add App
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddAppDialog;
