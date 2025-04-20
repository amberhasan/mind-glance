import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { styles as globalStyles } from "../constants/styles";

export default function GamesScreen() {
  const router = useRouter();

  return (
    <View style={globalStyles.container}>
      <Pressable onPress={() => router.replace("/home")} style={{ marginBottom: 20 }}>
        <Text style={{ color: "blue" }}>← Back</Text>
      </Pressable>

      <Text style={globalStyles.title}>Games 🎮</Text>

      <Pressable style={localStyles.gameButton} onPress={() => router.push("/games/wordle")}>
        <Text style={localStyles.buttonText}>🟩 Wordle</Text>
      </Pressable>

      <Pressable style={localStyles.gameButton} onPress={() => router.push("/games/sudoku")}>
        <Text style={localStyles.buttonText}>🔢 Sudoku</Text>
      </Pressable>

      <Pressable style={localStyles.gameButton} onPress={() => router.push("/games/memory")}>
        <Text style={localStyles.buttonText}>🧠 Memory Match</Text>
      </Pressable>
    </View>
  );
}

const localStyles = StyleSheet.create({
  gameButton: {
    backgroundColor: "#4caf50",
    padding: 16,
    borderRadius: 10,
    marginTop: 16,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
});
