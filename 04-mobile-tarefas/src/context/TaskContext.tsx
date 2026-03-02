import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Task, TaskPriority } from "../types";

type TaskInput = {
  title: string;
  notes?: string;
  dueDate?: string;
  priority: TaskPriority;
};

type TaskContextValue = {
  tasks: Task[];
  loading: boolean;
  addTask: (input: TaskInput) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
};

const STORAGE_KEY = "@portfolio_mobile_tasks";

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setTasks(JSON.parse(raw) as Task[]);
        }
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [loading, tasks]);

  function addTask(input: TaskInput) {
    const task: Task = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: input.title,
      notes: input.notes,
      dueDate: input.dueDate,
      priority: input.priority,
      done: false,
      createdAt: new Date().toISOString()
    };

    setTasks((prev) => [task, ...prev]);
  }

  function toggleTask(id: string) {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  const value = useMemo(
    () => ({
      tasks,
      loading,
      addTask,
      toggleTask,
      removeTask
    }),
    [tasks, loading]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks precisa ser usado dentro de TaskProvider");
  }
  return context;
}

