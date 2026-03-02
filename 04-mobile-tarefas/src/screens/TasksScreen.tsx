import React, { useMemo, useState } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { TaskItem } from "../components/TaskItem";
import { useTasks } from "../context/TaskContext";

type Filter = "todas" | "abertas" | "concluidas";

export function TasksScreen() {
  const { tasks, loading, toggleTask, removeTask } = useTasks();
  const [filter, setFilter] = useState<Filter>("todas");

  const filtered = useMemo(() => {
    if (filter === "abertas") {
      return tasks.filter((task) => !task.done);
    }
    if (filter === "concluidas") {
      return tasks.filter((task) => task.done);
    }
    return tasks;
  }, [tasks, filter]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Minhas tarefas</Text>
        <View style={styles.filterRow}>
          <FilterChip label="Todas" active={filter === "todas"} onPress={() => setFilter("todas")} />
          <FilterChip label="Abertas" active={filter === "abertas"} onPress={() => setFilter("abertas")} />
          <FilterChip
            label="Concluidas"
            active={filter === "concluidas"}
            onPress={() => setFilter("concluidas")}
          />
        </View>

        {loading ? (
          <View style={styles.emptyWrap}>
            <ActivityIndicator color="#0284c7" />
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>Nenhuma tarefa neste filtro.</Text>
          </View>
        ) : (
          <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 80 }}>
            {filtered.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => toggleTask(task.id)}
                onRemove={() => removeTask(task.id)}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

function FilterChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Text onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc"
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a"
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    marginBottom: 12,
    flexWrap: "wrap"
  },
  chip: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    color: "#334155",
    fontWeight: "600"
  },
  chipActive: {
    borderColor: "#0284c7",
    color: "#0284c7"
  },
  list: {
    flex: 1
  },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  emptyText: {
    color: "#64748b"
  }
});

