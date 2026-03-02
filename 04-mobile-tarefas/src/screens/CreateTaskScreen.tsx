import React, { useState } from "react";
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { useTasks } from "../context/TaskContext";
import { TaskPriority } from "../types";

export function CreateTaskScreen() {
  const { addTask } = useTasks();
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("media");

  function handleCreate() {
    if (title.trim().length < 3) {
      Alert.alert("Titulo invalido", "Digite pelo menos 3 caracteres.");
      return;
    }

    addTask({
      title: title.trim(),
      notes: notes.trim() || undefined,
      dueDate: dueDate.trim() || undefined,
      priority
    });

    setTitle("");
    setNotes("");
    setDueDate("");
    setPriority("media");

    Alert.alert("Tarefa criada", "Sua tarefa foi salva com sucesso.");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Criar nova tarefa</Text>

        <TextInput
          style={styles.input}
          placeholder="Titulo da tarefa"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Notas (opcional)"
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder="Prazo (ex: 2026-03-10)"
          value={dueDate}
          onChangeText={setDueDate}
        />

        <Text style={styles.subtitle}>Prioridade</Text>
        <View style={styles.priorityRow}>
          {(["baixa", "media", "alta"] as TaskPriority[]).map((item) => (
            <Pressable
              key={item}
              style={[styles.priorityButton, priority === item && styles.priorityButtonActive]}
              onPress={() => setPriority(item)}
            >
              <Text style={[styles.priorityText, priority === item && styles.priorityTextActive]}>{item}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.submit} onPress={handleCreate}>
          <Text style={styles.submitText}>Salvar tarefa</Text>
        </Pressable>
      </View>
    </SafeAreaView>
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
    marginBottom: 16
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 8,
    marginTop: 4
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    fontSize: 14
  },
  textArea: {
    minHeight: 96,
    textAlignVertical: "top"
  },
  priorityRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16
  },
  priorityButton: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8
  },
  priorityButtonActive: {
    borderColor: "#0284c7",
    backgroundColor: "#e0f2fe"
  },
  priorityText: {
    color: "#334155",
    fontWeight: "700"
  },
  priorityTextActive: {
    color: "#0369a1"
  },
  submit: {
    backgroundColor: "#0284c7",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center"
  },
  submitText: {
    color: "#fff",
    fontWeight: "800"
  }
});

