import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { styles as globalStyles } from "../constants/styles";

export default function GamesScreen() {
  const router = useRouter();

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Games 🎮</Text>

      <Pressable
        style={localStyles.gameButton}
        onPress={() => router.push("/games/wordle")}
      >
        <Image
          source={require("../assets/images/wordle.png")}
          style={localStyles.gameImage}
        />
        <Text style={localStyles.buttonText}>Wordle</Text>
      </Pressable>

      <Pressable
        style={localStyles.gameButton}
        onPress={() => router.push("/games/sudoku")}
      >
        <Image
          source={require("../assets/images/sudoku.png")}
          style={localStyles.gameImage}
        />
        <Text style={localStyles.buttonText}>Sudoku</Text>
      </Pressable>

      <Pressable
        style={localStyles.gameButton}
        onPress={() => router.push("/games/memory")}
      >
        <Image
          source={require("../assets/images/memory.png")}
          style={localStyles.gameImage}
        />
        <Text style={localStyles.buttonText}>Memory Match</Text>
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
  gameImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
});
