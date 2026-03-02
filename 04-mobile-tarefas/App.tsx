import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { TaskProvider } from "./src/context/TaskContext";
import { RootNavigator } from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <TaskProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </TaskProvider>
  );
}

