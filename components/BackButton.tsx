import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // <-- icon library, Expo already has it installed!

export default function BackButton() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.back()}
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
      }}
    >
      <Ionicons name="arrow-back" size={24} color="blue" />
      <Text style={{ color: "blue", fontSize: 18, marginLeft: 8 }}>Back</Text>
    </Pressable>
  );
}
