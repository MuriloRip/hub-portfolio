import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Task } from "../types";

type Props = {
  task: Task;
  onToggle: () => void;
  onRemove: () => void;
};

const priorityColor = {
  baixa: "#22c55e",
  media: "#f59e0b",
  alta: "#ef4444"
};

export function TaskItem({ task, onToggle, onRemove }: Props) {
  return (
    <View style={[styles.card, task.done && styles.cardDone]}>
      <View style={styles.header}>
        <Text style={[styles.title, task.done && styles.doneTitle]}>{task.title}</Text>
        <View style={[styles.badge, { backgroundColor: priorityColor[task.priority] }]}>
          <Text style={styles.badgeText}>{task.priority.toUpperCase()}</Text>
        </View>
      </View>

      {task.notes ? <Text style={styles.notes}>{task.notes}</Text> : null}

      <View style={styles.actions}>
        <Pressable onPress={onToggle} style={[styles.actionButton, styles.toggleButton]}>
          <Text style={styles.actionText}>{task.done ? "Reabrir" : "Concluir"}</Text>
        </Pressable>
        <Pressable onPress={onRemove} style={[styles.actionButton, styles.removeButton]}>
          <Text style={[styles.actionText, { color: "#b91c1c" }]}>Excluir</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 14,
    marginBottom: 10
  },
  cardDone: {
    opacity: 0.7
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a"
  },
  doneTitle: {
    textDecorationLine: "line-through"
  },
  notes: {
    marginTop: 6,
    color: "#475569",
    fontSize: 13
  },
  badge: {
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 8
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700"
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12
  },
  actionButton: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 8,
    alignItems: "center"
  },
  toggleButton: {
    borderColor: "#0ea5e9"
  },
  removeButton: {
    borderColor: "#fecaca"
  },
  actionText: {
    fontWeight: "700",
    color: "#0369a1"
  }
});

