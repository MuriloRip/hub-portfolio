import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CreateTaskScreen } from "../screens/CreateTaskScreen";
import { StatsScreen } from "../screens/StatsScreen";
import { TasksScreen } from "../screens/TasksScreen";

export type RootTabParamList = {
  Tarefas: undefined;
  Nova: undefined;
  Estatisticas: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#f8fafc",
    card: "#ffffff",
    primary: "#0ea5e9",
    text: "#0f172a",
    border: "#e2e8f0"
  }
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={theme}>
      <Tab.Navigator
        screenOptions={{
          headerTitleStyle: {
            fontWeight: "700"
          },
          tabBarActiveTintColor: "#0284c7",
          tabBarInactiveTintColor: "#64748b",
          tabBarStyle: {
            height: 62,
            paddingTop: 6,
            paddingBottom: 8,
            borderTopWidth: 0.5,
            borderTopColor: "#e2e8f0"
          }
        }}
      >
        <Tab.Screen name="Tarefas" component={TasksScreen} />
        <Tab.Screen name="Nova" component={CreateTaskScreen} options={{ title: "Nova tarefa" }} />
        <Tab.Screen name="Estatisticas" component={StatsScreen} options={{ title: "Progresso" }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

