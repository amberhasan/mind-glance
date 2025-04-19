import { View, Text, Pressable } from "react-native";
import { styles } from "../../constants/styles";
import { useRouter } from "expo-router";

export default function EmotionScanScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={{ marginBottom: 20 }}>
        <Text style={{ color: "blue" }}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>Emotion Scan 🧠</Text>
    </View>
  );
}
