import React, { useEffect, useState } from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function SudokuLevels() {
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const loadProgress = async () => {
      const saved = await AsyncStorage.getItem("sudokuProgress");
      setUnlockedLevel(saved ? parseInt(saved) : 1);
    };
    loadProgress();
  }, []);

  const goToLevel = (level: number) => {
    if (level <= unlockedLevel) {
      router.push({
        pathname: "/games/sudokulevels",
        params: { level: level.toString() },
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧩 Select a Sudoku Level</Text>

      <FlatList
        data={Array.from({ length: 20 }, (_, i) => i + 1)}
        numColumns={4}
        contentContainerStyle={styles.grid}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => {
          const isUnlocked = item <= unlockedLevel;
          return (
            <Pressable
              style={[
                styles.levelButton,
                isUnlocked ? styles.unlocked : styles.locked,
              ]}
              onPress={() => goToLevel(item)}
              disabled={!isUnlocked}
            >
              <Text style={styles.levelText}>
                {isUnlocked ? item : "🔒"}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#f4f4f5",
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  grid: {
    alignItems: "center",
  },
  levelButton: {
    margin: 8,
    padding: 20,
    borderRadius: 10,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  unlocked: {
    backgroundColor: "#4caf50",
  },
  locked: {
    backgroundColor: "#ccc",
  },
  levelText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
