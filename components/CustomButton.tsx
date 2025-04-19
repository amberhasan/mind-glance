import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function CustomButton({
  title,
  href,
  icon,
}: {
  title: string;
  href: string;
  icon: string;
}) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(href)}
      style={{
        backgroundColor: "#ffffff",
        padding: 20,
        borderRadius: 16,
        width: 140,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
      }}
    >
      <MaterialCommunityIcons name={icon} size={32} color="#4a4a4a" />
      <Text
        style={{
          color: "#1a1a1a",
          fontWeight: "bold",
          fontSize: 14,
          marginTop: 8,
          textAlign: "center",
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}
