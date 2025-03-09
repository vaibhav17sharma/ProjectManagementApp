import { Task } from "@prisma/client";

interface TaskDetailsProps {
  task: Task;
}

export default function TaskDetails({ task }: TaskDetailsProps ) {
  return (
    <pre>{JSON.stringify(task, null, 2)}</pre>
  );
}

