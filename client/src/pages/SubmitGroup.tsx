import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertWhatsAppGroupSchema, categories, countries } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import SuccessModal from "@/components/SuccessModal";
import { z } from "zod";
import { loginWithGoogle, logoutUser, auth, createAuthListener } from "@/lib/firebase";
import { FcGoogle } from "react-icons/fc";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Modified schema with terms checkbox
const extendedSchema = insertWhatsAppGroupSchema.extend({
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type FormValues = {
  name: string;
  description: string;
  category: string;
  country: string;
  link: string;
  owner: string;
  terms: boolean;
};

export default function SubmitGroup() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [linkPreview, setLinkPreview] = useState({
    title: "",
    image: "",
    description: ""
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(extendedSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      country: "Global",
      link: "",
      owner: "",
      terms: false,
    },
  });

  // Set up auth listener
  useEffect(() => {
    const unsubscribe = createAuthListener((user) => {
      setIsLoggedIn(!!user);
      if (user && user.displayName) {
        form.setValue('owner', user.displayName);
      }
    });
    
    // Cleanup on unmount
    return () => unsubscribe();
  }, [form]);

  // Watch the link field for changes
  const linkValue = form.watch("link");
  
  // Update link preview when link changes
  useEffect(() => {
    async function fetchLinkMetadata() {
      if (linkValue && linkValue.includes("chat.whatsapp.com")) {
        try {
          // WhatsApp doesn't expose full OG data for group invites, 
          // so we'll use a conditional approach:
          // First try to fetch metadata, fallback to default if not available
          const response = await fetch(`/api/link-preview?url=${encodeURIComponent(linkValue)}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch metadata');
          }
          
          const data = await response.json();
          
          if (data && (data.title || data.image || data.description)) {
            setLinkPreview({
              title: data.title || "WhatsApp Group",
              image: data.image || "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png",
              description: data.description || "Click to join this WhatsApp group"
            });
          } else {
            // Fallback to default preview if no metadata found
            setLinkPreview({
              title: "WhatsApp Group",
              image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png",
              description: `Click to join this WhatsApp group: ${linkValue.split('/').pop()}`
            });
          }
        } catch (error) {
          console.error("Error fetching link metadata:", error);
          // Use default preview on error
          setLinkPreview({
            title: "WhatsApp Group",
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png",
            description: `Click to join this WhatsApp group: ${linkValue.split('/').pop()}`
          });
        }
      }
    }
    
    if (linkValue) {
      fetchLinkMetadata();
    }
  }, [linkValue]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: Omit<FormValues, "terms">) => {
      return apiRequest("POST", "/api/groups", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/groups"] });
      setShowSuccessModal(true);
      form.reset();
    },
  });

  const onSubmit = (data: FormValues) => {
    const { terms, ...groupData } = data;
    // Send data to server with members count
    mutate(groupData);
  };

  return (
    <>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Submit Your WhatsApp Group</h2>
        
        {/* Authentication prompt */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-medium text-gray-900">
                {isLoggedIn ? "You're signed in" : "Sign in to manage your groups"}
              </h3>
              <p className="text-sm text-gray-500">
                {isLoggedIn 
                  ? "You can submit and edit your WhatsApp groups" 
                  : "Use your Google account to easily manage your submitted groups"}
              </p>
            </div>
            {isLoggedIn ? (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => logoutUser()}
                className="flex items-center gap-2"
              >
                Sign out
              </Button>
            ) : (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => loginWithGoogle()}
                className="flex items-center gap-2"
              >
                <FcGoogle className="h-5 w-5" />
                Sign in with Google
              </Button>
            )}
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your group name" {...field} />
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
                  <FormLabel>Group Description *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your group (purpose, topics, rules, etc.)" 
                      rows={4}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp Group Link *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://chat.whatsapp.com/..." 
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Must be a valid WhatsApp group invite link
                  </FormDescription>
                  <FormMessage />
                  
                  {/* Link preview */}
                  {linkValue && linkValue.includes("chat.whatsapp.com") && (
                    <div className="mt-2 border rounded-md p-3 flex items-center space-x-3 bg-gray-50">
                      {linkPreview.image && (
                        <img 
                          src={linkPreview.image} 
                          alt="WhatsApp"
                          className="h-10 w-10"
                        />
                      )}
                      <div>
                        <p className="font-medium text-sm">{linkPreview.title}</p>
                        <p className="text-gray-500 text-xs">{linkPreview.description}</p>
                      </div>
                    </div>
                  )}
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="owner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I agree to the <a href="#" className="text-primary hover:underline">Terms and Conditions</a> and confirm this group follows community guidelines
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Submitting..." : "Submit Group"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
      />
    </>
  );
}
