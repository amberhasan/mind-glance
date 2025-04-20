import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";

const base = 3;
const side = base * base;

export default function SudokuLevelPage() {
  const { level } = useLocalSearchParams();
  const parsedLevel = parseInt(level as string, 10) || 1;

  const [board, setBoard] = useState<number[][]>([]);
  const [original, setOriginal] = useState<number[][]>([]);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [xp, setXp] = useState(0);
  const [hintCount, setHintCount] = useState(3);

  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const savedXP = await AsyncStorage.getItem("xp");
      const savedHints = await AsyncStorage.getItem("hintCount");
      setXp(savedXP ? parseInt(savedXP) : 0);
      setHintCount(savedHints ? parseInt(savedHints) : 3);
    };
    loadData();
    generateBoard(parsedLevel);
  }, [parsedLevel]);

  const shuffle = (arr: any[]) => [...arr].sort(() => Math.random() - 0.5);

  const generateBoard = (difficulty: number) => {
    const pattern = (r: number, c: number) =>
      (base * (r % base) + Math.floor(r / base) + c) % side;

    const rBase = [0, 1, 2];
    const rows = rBase.flatMap((g) => shuffle(rBase).map((r) => g * base + r));
    const cols = rBase.flatMap((g) => shuffle(rBase).map((c) => g * base + c));
    const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    const board = Array.from({ length: side }, (_, r) =>
      Array.from({ length: side }, (_, c) => nums[pattern(rows[r], cols[c])])
    );

    const clues = 81 - Math.floor((difficulty / 20) * 40);
    const allCoords: [number, number][] = [];

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        allCoords.push([r, c]);
      }
    }

    const shuffleCoords = shuffle(allCoords);
    for (let i = 0; i < 81 - clues; i++) {
      const [r, c] = shuffleCoords[i];
      board[r][c] = 0;
    }

    setBoard(JSON.parse(JSON.stringify(board)));
    setOriginal(JSON.parse(JSON.stringify(board)));
  };

  const handleSelect = (r: number, c: number) => {
    if (original[r][c] === 0) {
      setSelected([r, c]);
    }
  };

  const handleInput = (n: number) => {
    if (!selected) return;
    const [r, c] = selected;
    const updated = [...board];
    updated[r][c] = n;
    setBoard(updated);
  };

  const isComplete = () => board.every((row) => row.every((n) => n > 0));

  const checkSolution = async () => {
    const isValid = (arr: number[]) =>
      new Set(arr).size === 9 && arr.every((n) => n >= 1 && n <= 9);

    for (let i = 0; i < 9; i++) {
      const row = board[i];
      const col = board.map((r) => r[i]);
      const block = board
        .slice(Math.floor(i / 3) * 3, Math.floor(i / 3) * 3 + 3)
        .flatMap((r) => r.slice((i % 3) * 3, (i % 3) * 3 + 3));
      if (!isValid(row) || !isValid(col) || !isValid(block)) {
        return Alert.alert("❌ Incorrect", "There's a mistake. Try again!");
      }
    }

    const newXP = xp + 100;
    setXp(newXP);
    await AsyncStorage.setItem("xp", newXP.toString());

    const storedProgress = await AsyncStorage.getItem("sudokuProgress");
    const progress = storedProgress ? parseInt(storedProgress) : 1;

    if (parsedLevel === progress && parsedLevel < 20) {
      await AsyncStorage.setItem(
        "sudokuProgress",
        (parsedLevel + 1).toString()
      );
    }

    Alert.alert(
      "🎉 Congrats!",
      "This is right!",
      [
        {
          text: "Go Back",
          onPress: () => router.replace("/games/sudoku"),
        },
        {
          text: "Next Level",
          onPress: () =>
            router.replace({
              pathname: "/games/sudokulevels",
              params: { level: (parsedLevel + 1).toString() },
            }),
        },
      ]
    );
  };

  const useHint = async () => {
    if (hintCount <= 0) {
      Alert.alert("No hints left!");
      return;
    }

    const empties: [number, number][] = [];

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (original[r][c] === 0 && board[r][c] === 0) {
          empties.push([r, c]);
        }
      }
    }

    if (empties.length === 0) {
      Alert.alert("Nothing to hint!");
      return;
    }

    const [r, c] = empties[Math.floor(Math.random() * empties.length)];
    const updated = [...board];
    updated[r][c] = generateSolution(r, c);
    setBoard(updated);

    const updatedHint = hintCount - 1;
    setHintCount(updatedHint);
    await AsyncStorage.setItem("hintCount", updatedHint.toString());
  };

  const generateSolution = (r: number, c: number) => {
    const row = board[r].filter((v) => v !== 0);
    const col = board.map((row) => row[c]).filter((v) => v !== 0);
    const box = board
      .slice(Math.floor(r / 3) * 3, Math.floor(r / 3) * 3 + 3)
      .flatMap((row) =>
        row.slice(Math.floor(c / 3) * 3, Math.floor(c / 3) * 3 + 3)
      )
      .filter((v) => v !== 0);

    const possible = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
      (n) => !row.includes(n) && !col.includes(n) && !box.includes(n)
    );
    return possible[Math.floor(Math.random() * possible.length)];
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Text style={{ color: "blue" }}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>Level {parsedLevel}</Text>
      <Text style={styles.status}>XP: {xp} | Hints: {hintCount}</Text>

      <View style={styles.grid}>
        {board.map((row, r) => (
          <View key={r} style={styles.row}>
            {row.map((val, c) => {
              const isSelected = selected?.[0] === r && selected?.[1] === c;
              const isInitial = original[r][c] !== 0;

              return (
                <Pressable
                  key={`${r}-${c}`}
                  onPress={() => handleSelect(r, c)}
                  style={[
                    styles.cell,
                    isInitial && styles.fixed,
                    isSelected && styles.selected,
                  ]}
                >
                  <Text style={styles.cellText}>{val !== 0 ? val : ""}</Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      {/* Number Pad */}
      <View style={styles.pad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <Pressable key={n} onPress={() => handleInput(n)} style={styles.padBtn}>
            <Text style={styles.padText}>{n}</Text>
          </Pressable>
        ))}
      </View>

      {/* Buttons */}
      <Pressable style={styles.button} onPress={checkSolution}>
        <Text style={styles.buttonText}>✅ Check Solution</Text>
      </Pressable>

      <Pressable style={styles.hintBtn} onPress={useHint}>
        <Text style={styles.hintText}>💡 Use Hint</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center",
  },
  backBtn: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 6,
  },
  status: {
    fontSize: 16,
    marginBottom: 12,
    color: "#444",
  },
  grid: {
    borderWidth: 2,
    borderColor: "#000",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: 36,
    height: 36,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  cellText: {
    fontSize: 16,
  },
  fixed: {
    backgroundColor: "#eee",
  },
  selected: {
    borderColor: "#4caf50",
    borderWidth: 2,
  },
  pad: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
    justifyContent: "center",
  },
  padBtn: {
    width: 40,
    height: 40,
    backgroundColor: "#ddd",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    margin: 6,
  },
  padText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#4caf50",
    padding: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  hintBtn: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#ffeb3b",
    borderRadius: 6,
  },
  hintText: {
    fontWeight: "bold",
    color: "#444",
  },
});
