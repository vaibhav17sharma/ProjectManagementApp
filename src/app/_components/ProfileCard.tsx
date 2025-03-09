"use client";
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
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type User } from "@prisma/client";
import { signOut } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Schema for normal user details
const userDetailsSchema = z
  .object({
    email: z.string().email({ message: "Pleas e enter a valid email" }),
    name: z.string().min(1, { message: "Name is required" }),
    image: z.string().url({ message: "Please enter a valid image URL" }),
    role: z.string().min(1, { message: "Role is required" }),
  });

// Schema for password update
const passwordUpdateSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, { message: "Current password must be at least 6 characters" })
      .optional(),
    newPassword: z
      .string()
      .min(6, { message: "New password must be at least 6 characters" })
      .optional(),
    confirmPassword: z
      .string()
      .min(6, { message: "Please confirm your new password" })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && data.confirmPassword) {
        return data.newPassword === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  )
  .refine(
    (data) => {
      // Ensure that currentPassword, newPassword, and confirmPassword are all required if updating password
      if (data.newPassword || data.confirmPassword) {
        return data.currentPassword && data.newPassword && data.confirmPassword;
      }
      return true;
    },
    {
      message: "All password fields are required when updating the password",
      path: ["currentPassword", "newPassword", "confirmPassword"],
    }
  );

const ProfileCard = ({ user }: { user: User }) => {

  const formDetails = useForm({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      email: user.email,
      name: user.name ?? "",
      image: user.image ?? "",
      role: user.role,
    },
  });

  const formPassword = useForm({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { mutate: updateUserDetails } = api.user.updateUser.useMutation();
  const { mutate: updatePassword } = api.user.updatePassword.useMutation();

  const onSubmitDetails = (data: z.infer<typeof userDetailsSchema>) => {
    updateUserDetails({ id: user.id, ...data });
    toast.success("User details updated successfully");
    void setTimeout(() => {
      void signOut();
    }, 1000);
  };

  const onSubmitPassword = (data: z.infer<typeof passwordUpdateSchema>) => {
    if (!data.currentPassword || !data.newPassword || !data.confirmPassword) {
      toast.error("Please fill all the fields");
      return;
    }
    const updatedData = {
      id: user.id,
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    };
  
    updatePassword(updatedData);
    toast.success("Password updated successfully");
  
    void setTimeout(() => {
      void signOut();
    }, 1000);
  };
  

  return (
    <div className="flex space-x-8">
      <div className="w-1/2">
        <Form {...formDetails}>
          <form onSubmit={formDetails.handleSubmit(onSubmitDetails)} className="space-y-6">
            <FormField
              name="name"
              control={formDetails.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter your name"
                      className="mt-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={formDetails.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      className="mt-2"
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="image"
              control={formDetails.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter image URL"
                      className="mt-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="role"
              control={formDetails.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter role"
                      className="mt-2"
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-6 flex justify-end">
              <Button
                type="submit"
                className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="w-1/2">
        <Form {...formPassword}>
          <form onSubmit={formPassword.handleSubmit(onSubmitPassword)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                name="currentPassword"
                control={formPassword.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter your current password"
                        className="mt-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="newPassword"
                control={formPassword.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter new password"
                        className="mt-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="confirmPassword"
                control={formPassword.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Confirm new password"
                        className="mt-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Update Password
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfileCard;
