import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";

type Props = {
  navigation: DrawerNavigationProp<any>;
};

export const HeaderLeft = ({ navigation }: Props) => (
  <TouchableOpacity
    onPress={() => navigation.openDrawer()}
    style={{ marginLeft: 16 }}
  >
    <Ionicons name="menu" size={24} color="#fff" />
  </TouchableOpacity>
);
