"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Textarea } from "@/components/ui/textarea";
import { cn, formatDate } from "@/lib/utils";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label, Tag } from "@prisma/client";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define Zod schema for form validation
const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  deadline: z.date().min(new Date(), { message: "Deadline invalid" }),
  priority: z.enum(["low", "medium", "high"]),
  label: z.nativeEnum(Label),
  assignedTo: z.array(z.string()).min(1, "At least one team member is required"),
  tags: z.array(z.nativeEnum(Tag)).min(1, "At least one tag is required"),
});

type TaskFormData = z.infer<typeof taskSchema>;

const TaskForm: React.FC = () => {
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      deadline: new Date(),
      priority: "low",
      label: "FRONTEND",
      assignedTo: [],
      tags: [],
    },
  });
  const { mutate: createTask } = api.task.create.useMutation();
  const { data: users } = api.user.getAllUsers.useQuery();
  const onSubmit = async (data: TaskFormData) => {
    console.log(data);
    await createTask(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Enter task title"
                  className="mt-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter task description"
                  rows={4}
                  className="mt-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            name="deadline"
            control={form.control}
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="block my-1">Deadline</FormLabel>{" "}
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground", "py-2"
                        )}
                      >
                        {field.value ? (
                          formatDate(field.value)
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        fromYear={2025}
                        toYear={2030}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="priority"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            name="label"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Label" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FRONTEND">Frontend</SelectItem>
                      <SelectItem value="BACKEND">Backend</SelectItem>
                      <SelectItem value="DESIGN">Design</SelectItem>
                      <SelectItem value="DOCUMENTATION">Documentation</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="tags"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={[
                      { label: "Urgent", value: "URGENT" },
                      { label: "Feature", value: "FEATURE" },
                      { label: "Bug", value: "BUG" },
                      { label: "Test", value: "TEST" },
                    ]}
                    placeholder="Select tags"
                    maxCount={3}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
            name="assignedTo"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assign to</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={users?.map((user) => ({ label: user.name as string, value: user.id })) || []}
                    placeholder="Select team member"
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <Button type="submit" className="mt-4">
          Create Task
        </Button>
      </form>
    </Form>
  );
};

export default TaskForm;
