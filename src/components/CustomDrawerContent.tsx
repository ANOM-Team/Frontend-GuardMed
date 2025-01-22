import React from "react";
import { View, StyleSheet } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        <DrawerItem
          icon={({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          )}
          label="Home"
          onPress={() => props.navigation.navigate("Home")}
        />

        <DrawerItem
          icon={({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          )}
          label="Profile"
          onPress={() => props.navigation.navigate("Profile")}
        />

        <DrawerItem
          icon={({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          )}
          label="Settings"
          onPress={() => props.navigation.navigate("Settings")}
        />

        <DrawerItem
          icon={({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          )}
          label="Logout"
          onPress={handleLogout}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingTop: 20,
  },
});
