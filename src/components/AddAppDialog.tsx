
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AppStore, BusinessModel, DrugRating, drugFactors } from "@/lib/appData";
import { useToast } from "@/hooks/use-toast";
import { addApp } from "@/lib/supabase";
import { Checkbox } from "@/components/ui/checkbox";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";

const businessModels: BusinessModel[] = [
  'Pay Once',
  'Subscription',
  'Freemium',
  'Advertising',
  'In-App Purchases',
  'Unknown'
];

const stores: AppStore[] = ['Apple App Store', 'Google Play', 'Both'];
const ratings: DrugRating[] = ['Tool', 'Sugar', 'Coffee', 'Alcohol', 'Drug'];

const addAppSchema = z.object({
  name: z.string().min(2, { message: "App name must be at least 2 characters." }),
  developer: z.string().min(2, { message: "Developer name is required." }),
  category: z.string().min(2, { message: "Category is required." }),
  description: z.string().optional(),
  icon: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  store: z.enum(['Apple App Store', 'Google Play', 'Both']),
  rating: z.enum(['Tool', 'Sugar', 'Coffee', 'Alcohol', 'Drug']),
  businessModel: z.enum(['Pay Once', 'Subscription', 'Freemium', 'Advertising', 'In-App Purchases', 'Unknown']).optional(),
  factors: z.array(
    z.object({
      name: z.string(),
      present: z.boolean().default(false),
    })
  )
});

type FormValues = z.infer<typeof addAppSchema>;

export const AddAppDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(addAppSchema),
    defaultValues: {
      name: '',
      developer: '',
      category: '',
      description: '',
      icon: '',
      store: 'Both',
      rating: 'Tool',
      factors: drugFactors.map(factor => ({
        name: factor.name,
        present: false,
      }))
    }
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await addApp(values);
      
      toast({
        title: "App Added",
        description: `${values.name} was added successfully.`,
      });
      
      // Invalidate queries to refresh the app list
      queryClient.invalidateQueries({ queryKey: ['apps'] });
      
      // Reset form and close dialog
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Error adding app:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add app. Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Plus size={16} />
          Add App
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New App</DialogTitle>
          <DialogDescription>
            Enter the details of the app you want to add to the database.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>App Name*</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Developer*</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category*</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} placeholder="https://example.com/icon.png" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="store"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>App Store*</FormLabel>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      {...field}
                    >
                      {stores.map(store => (
                        <option key={store} value={store}>{store}</option>
                      ))}
                    </select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating*</FormLabel>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      {...field}
                    >
                      {ratings.map(rating => (
                        <option key={rating} value={rating}>{rating}</option>
                      ))}
                    </select>
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
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      {...field}
                      value={field.value || ''}
                    >
                      <option value="">Select...</option>
                      {businessModels.map(model => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Digital Wellbeing Factors</h3>
              <p className="text-sm text-gray-600 mb-4">Select which factors are present in this app:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                {drugFactors.map((factor, index) => (
                  <FormField
                    key={factor.name}
                    control={form.control}
                    name={`factors.${index}.present`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md py-1">
                        <FormControl>
                          <Checkbox 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-0.5">
                          <FormLabel className="font-normal">{factor.name}</FormLabel>
                          <FormDescription className="text-xs">
                            {factor.description}
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  form.reset();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Add App</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAppDialog;
