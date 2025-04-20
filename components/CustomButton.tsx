import React from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  href: string;
};

export default function CustomButton({ title, icon, href }: Props) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(href)}
      style={({ pressed }) => [
        styles.button,
        pressed ? styles.pressed : styles.shadow,
      ]}
    >
      <MaterialCommunityIcons name={icon} size={28} color="white" />
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 150,
    height: 100,
    backgroundColor: "#1976d2",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    transition: "all 0.2s ease-in-out",
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    backgroundColor: "#115293",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  text: {
    color: "white",
    marginTop: 8,
    fontWeight: "bold",
    fontSize: 16,
  },
});
