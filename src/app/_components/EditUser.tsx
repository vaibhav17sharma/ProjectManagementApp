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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, UserRole } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";


const userSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  name: z.string().min(1, "Name is required"),
  image: z.string().url("Invalid image URL"),
  role: z.enum([UserRole.EMPLOYEE, UserRole.ADMIN]),
});

type UserFormData = z.infer<typeof userSchema>;


export default function EditUser({
  open,
  setOpen,
  user,
}: {
  open: boolean;
  setOpen: (open: string | null) => void;
  user: User;
}) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: user.email,
      name: user.name || "",
      image: user.image || "",
      role: user.role,
    },
  });

  const { mutate: updateUser } = api.user.updateUser.useMutation();

  const onSubmit = async (data: UserFormData) => {
    updateUser({ id: user.id, ...data });
    setOpen(null);
  };

  const onCancel = () => {
    setOpen(null);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Enter user email"
                  className="mt-2"
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Enter user name"
                  className="mt-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="image"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Image URL</FormLabel>
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
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.EMPLOYEE}>Employee</SelectItem>
                    <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-4 flex gap-4">
          <Button type="submit" className="mt-4">
            Save
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="mt-4"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
