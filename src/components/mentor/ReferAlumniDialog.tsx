
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

// Define the form schema using zod
const referralSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
});

type ReferralFormData = z.infer<typeof referralSchema>;

interface ReferAlumniDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReferralComplete: () => void;
}

const ReferAlumniDialog: React.FC<ReferAlumniDialogProps> = ({
  open,
  onOpenChange,
  onReferralComplete,
}) => {
  const { user } = useAuth();
  const form = useForm<ReferralFormData>({
    resolver: zodResolver(referralSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const onSubmit = async (data: ReferralFormData) => {
    try {
      // First, store the referral in the database
      const { error } = await supabase.from("mentor_referrals").insert({
        referrer_id: user?.id,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        status: "pending",
      });

      if (error) throw error;

      // Call an edge function to send the email
      const response = await fetch("/api/send-referral-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          referrerName: `${user?.user_metadata?.first_name || ""} ${
            user?.user_metadata?.last_name || ""
          }`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send referral email");
      }

      toast({
        title: "Referral sent successfully",
        description: `An invitation has been sent to ${data.firstName} ${data.lastName}`,
      });
      form.reset();
      onReferralComplete();
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting referral:", error);
      toast({
        variant: "destructive",
        title: "Error sending referral",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Refer an Alumni</DialogTitle>
          <DialogDescription>
            Invite a fellow alumni to join as a mentor. We'll send them an email with a sign-up link.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Send Invitation</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReferAlumniDialog;
