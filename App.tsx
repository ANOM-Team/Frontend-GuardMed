import "react-native-gesture-handler";
import React from "react";
import AppNavigator from "./src/navigation/AppNavigation";
import { AuthProvider } from "./src/context/AuthContext";
import "./global.css";

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
