import React, { useMemo } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useTasks } from "../context/TaskContext";

export function StatsScreen() {
  const { tasks } = useTasks();

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((task) => task.done).length;
    const open = total - done;
    const high = tasks.filter((task) => task.priority === "alta" && !task.done).length;
    const progress = total === 0 ? 0 : Math.round((done / total) * 100);

    return { total, done, open, high, progress };
  }, [tasks]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Resumo de produtividade</Text>

        <View style={styles.progressWrap}>
          <View style={[styles.progressFill, { width: `${stats.progress}%` }]} />
        </View>
        <Text style={styles.progressLabel}>{stats.progress}% concluido</Text>

        <View style={styles.grid}>
          <Card label="Total" value={String(stats.total)} />
          <Card label="Concluidas" value={String(stats.done)} />
          <Card label="Abertas" value={String(stats.open)} />
          <Card label="Alta prioridade" value={String(stats.high)} />
        </View>
      </View>
    </SafeAreaView>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
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
    color: "#0f172a",
    marginBottom: 14
  },
  progressWrap: {
    height: 14,
    backgroundColor: "#e2e8f0",
    borderRadius: 999,
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#0284c7"
  },
  progressLabel: {
    marginTop: 8,
    color: "#334155",
    fontWeight: "700",
    marginBottom: 18
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 14
  },
  cardLabel: {
    color: "#64748b",
    fontWeight: "600"
  },
  cardValue: {
    marginTop: 6,
    fontSize: 28,
    color: "#0f172a",
    fontWeight: "800"
  }
});

