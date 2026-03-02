export type TaskPriority = "baixa" | "media" | "alta";

export type Task = {
  id: string;
  title: string;
  notes?: string;
  done: boolean;
  createdAt: string;
  dueDate?: string;
  priority: TaskPriority;
};
