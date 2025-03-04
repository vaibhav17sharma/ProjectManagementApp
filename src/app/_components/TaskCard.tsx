"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import { GripVertical } from "lucide-react";
import { ColumnId } from "./KanbanBoard";

export interface Task {
  id: UniqueIdentifier;
  title: string;
  columnId: ColumnId;
  description: string;
  deadline: Date;
  priority: string;
  label: string;
  assignedTo: string[];
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
        <Badge variant={"outline"} className={cn("ml-auto font-semibold", new Date(task.deadline).toDateString() < new Date().toDateString() && "bg-red-500 border-red-500 text-white")}>
          {task.label}
        </Badge>
      </CardHeader>
      <CardContent className="whitespace-pre-wrap px-3 pb-6 pt-3 text-left">
        <div className="flex flex-col gap-2">
          <span className="text-lg font-semibold">{task.title}</span>
          <span className="text-sm text-gray-500">{task.description}</span>
          <span className="flex gap-1">
            {task.assignedTo.map((assignee) => (
              <Avatar key={assignee}>
                <AvatarFallback>
                  {assignee.charAt(0)}
                  {assignee.split(" ")[1]?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ))}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
