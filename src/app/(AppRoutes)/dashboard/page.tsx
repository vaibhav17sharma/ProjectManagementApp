"use client";
import { KanbanBoard } from "@/app/_components/KanbanBoard";
import TaskForm from "@/app/_components/TaskForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type SessionUser } from "@/server/auth/config";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  if (!session) {
    redirect('/');
  }

  return (
    <div className="mt-3 flex flex-col items-center justify-center gap-3">
      <div className="flex w-full items-center justify-between">
        <span className="text-2xl font-bold">Tasks Dashboard</span>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="mt-0">Add Task</Button>
          </DialogTrigger>
          <DialogContent className="md:max-w-2lg max-w-[425px] lg:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add Task</DialogTitle>
              <DialogDescription>Add Task details here</DialogDescription>
            </DialogHeader>
            <TaskForm setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="w-full">
        <KanbanBoard user={session?.user as SessionUser} />
      </div>
    </div>
  );
}
