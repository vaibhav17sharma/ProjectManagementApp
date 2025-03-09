"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { type UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type ColumnStatus, type User } from "@prisma/client";
import { cva } from "class-variance-authority";
import { GripVertical, Pencil } from "lucide-react";
import { useState } from "react";
import EditTaskForm from "./EditTaskForm";
export interface Task {
  id: UniqueIdentifier;
  title: string;
  column: ColumnStatus;
  description: string;
  deadline: Date;
  priority: string;
  label: string;
  assignedTo: User[];
  tags: string[];
}

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
}

export type TaskType = "Task";

export interface TaskDragData {
  type: TaskType;
  task: Task;
}

export function TaskCard({ task, isOverlay }: TaskCardProps) {
  const [open, setOpen] = useState(false);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    } satisfies TaskDragData,
    attributes: {
      roleDescription: "Task",
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn (variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      }), new Date(task.deadline).toDateString() < new Date().toDateString() && "rounded-t-md border-red-500")}
    >
      <CardHeader
        className={cn(
          "space-between relative flex flex-row border-b-2 border-secondary px-3 py-3",
          new Date(task.deadline).toDateString() < new Date().toDateString() &&
            "bg-red-200 rounded-t-md border-red-500",
        )}
      >
        <Button
          variant={"ghost"}
          {...attributes}
          {...listeners}
          className="-ml-2 h-auto cursor-grab p-1 text-secondary-foreground/50"
        >
          <span className="sr-only">Move task</span>
          <GripVertical className={cn(new Date(task.deadline).toDateString() < new Date().toDateString() && "text-red-500")} />
        </Button>
        <Badge variant={"outline"} className={cn("ml-auto font-semibold mr-2", new Date(task.deadline).toDateString() < new Date().toDateString() && "bg-red-500 border-red-500 text-white")}>
          {task.label}
        </Badge>
        <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-4">
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Edit the task details</DialogDescription>
          </DialogHeader>
          <EditTaskForm setOpen={setOpen} task={task} />
        </DialogContent>
      </Dialog>
      </CardHeader>
      <CardContent className="whitespace-pre-wrap px-3 pb-6 pt-3 text-left">
        <div className="flex flex-col gap-2">
          <span className="text-lg font-semibold">{task.title}</span>
          <span className="text-sm text-gray-500">{task.description}</span>
          <span className="flex gap-1">
            {task.assignedTo.map((assignee) => (
              <Avatar key={assignee.id}>
                <AvatarFallback>
                  {assignee.name?.charAt(0)}
                  {assignee.name?.charAt(1)}
                </AvatarFallback>
              </Avatar>
            ))}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
