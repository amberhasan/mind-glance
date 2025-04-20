import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const WORD_LIST = ["apple", "grape", "peach", "lemon", "melon"];
const MAX_GUESSES = 6;
const WORD_LENGTH = 5;
const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M", "⌫", "↵"],
];

export default function WordleGame() {
  const router = useRouter();

  const [targetWord, setTargetWord] = useState(
    WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)].toLowerCase()
  );
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [eliminatedLetters, setEliminatedLetters] = useState<string[]>([]);
  const [xp, setXp] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const [hintCount, setHintCount] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const savedXp = await AsyncStorage.getItem("xp");
      const savedHints = await AsyncStorage.getItem("hintCount");
      if (savedXp !== null) setXp(parseInt(savedXp));
      setHintCount(savedHints ? parseInt(savedHints, 10) : 3);
    };
    loadData();
  }, []);

  const addXP = async (amount: number) => {
    const newXp = xp + amount;
    setXp(newXp);
    await AsyncStorage.setItem("xp", newXp.toString());
  };

  const resetGame = () => {
    setTargetWord(
      WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)].toLowerCase()
    );
    setGuesses([]);
    setCurrentGuess("");
    setGameOver(false);
    setEliminatedLetters([]);
    setHint(null);
    addXP(10); // +10 XP for starting a new game
  };

  const handleGuess = () => {
    if (currentGuess.length !== WORD_LENGTH)
      return Alert.alert("Enter a 5-letter word");

    const guessLower = currentGuess.toLowerCase();
    const newGuesses = [...guesses, guessLower];
    setGuesses(newGuesses);
    setCurrentGuess("");

    const notInWord = guessLower
      .split("")
      .filter((char) => !targetWord.includes(char) && !eliminatedLetters.includes(char));
    setEliminatedLetters([...eliminatedLetters, ...notInWord]);

    if (guessLower === targetWord) {
      addXP(50); // +50 XP for winning
      Alert.alert("🎉 You guessed it!");
      setGameOver(true);
    } else if (newGuesses.length === MAX_GUESSES) {
      Alert.alert("😞 Game Over", `The word was: ${targetWord.toUpperCase()}`);
      setGameOver(true);
    }
  };

  const handleKeyPress = (key: string) => {
    if (gameOver) return;
    if (key === "⌫") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (key === "↵") {
      handleGuess();
    } else if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess((prev) => prev + key.toLowerCase());
    }
  };

  const getHint = async () => {
    if (hintCount === null) return;
    if (hintCount <= 0) {
      setHint("❌ No hints left!");
      return;
    }

    const unrevealedIndices = [...targetWord]
      .map((char, i) => (guesses.some(g => g[i] === char) ? null : i))
      .filter(i => i !== null) as number[];

    if (unrevealedIndices.length === 0) {
      setHint("All letters already revealed!");
      return;
    }

    const randomIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
    const updatedCount = hintCount - 1;
    setHintCount(updatedCount);
    await AsyncStorage.setItem("hintCount", updatedCount.toString());
    setHint(`🧩 Hint (${updatedCount} left): Letter ${randomIndex + 1} is ${targetWord[randomIndex].toUpperCase()}`);
  };

  const getFeedback = (guess: string, index: number) => {
    return guess.split("").map((char, i) => {
      const match =
        char === targetWord[i]
          ? "#4caf50"
          : targetWord.includes(char)
          ? "#fbc02d"
          : "#9e9e9e";

      return (
        <View
          key={`${index}-${i}`}
          style={[
            styles.box,
            { backgroundColor: match, borderColor: "black", borderWidth: 2 },
          ]}
        >
          <Text style={styles.boxText}>{char.toUpperCase()}</Text>
        </View>
      );
    });
  };

  const renderKeyboard = () => {
    return KEYBOARD_ROWS.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.keyboardRow}>
        {row.map((letter) => {
          const isEliminated =
            eliminatedLetters.includes(letter.toLowerCase()) &&
            !["⌫", "↵"].includes(letter);
          return (
            <Pressable
              key={letter}
              onPress={() => handleKeyPress(letter)}
              disabled={isEliminated}
              style={[
                styles.keyButton,
                isEliminated && { backgroundColor: "#ccc", opacity: 0.3 },
              ]}
            >
              <Text style={styles.keyText}>{letter}</Text>
            </Pressable>
          );
        })}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.replace("/home")} style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 16, color: "blue" }}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>🟩 Wordle Clone</Text>
      <Text style={styles.xp}>🧠 XP: {xp}</Text>

      {guesses.map((guess, index) => (
        <View key={index} style={styles.row}>
          {getFeedback(guess, index)}
        </View>
      ))}

      {!gameOver && (
        <>
          <View style={styles.row}>
            {[...Array(WORD_LENGTH)].map((_, i) => (
              <View
                key={i}
                style={[styles.box, { borderColor: "black", borderWidth: 2 }]}
              >
                <Text style={styles.boxText}>
                  {currentGuess[i] ? currentGuess[i].toUpperCase() : ""}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.keyboard}>{renderKeyboard()}</View>

          <Pressable onPress={getHint} style={styles.hintButton}>
            <Text style={styles.hintText}>🧠 Get a Hint</Text>
          </Pressable>

          {hint && (
            <Text style={styles.hintMessage}>{hint}</Text>
          )}
        </>
      )}

      {gameOver && guesses.length === MAX_GUESSES && (
        <Text style={styles.reveal}>
          The correct word was:{" "}
          <Text style={styles.revealWord}>{targetWord.toUpperCase()}</Text>
        </Text>
      )}

      {gameOver && guesses[guesses.length - 1] === targetWord && (
        <Text style={styles.congrats}>
          🎉 Congrats! You guessed the word:{" "}
          <Text style={styles.congratsWord}>{targetWord.toUpperCase()}</Text>
        </Text>
      )}

      {gameOver && (
        <Pressable onPress={resetGame} style={styles.playAgainButton}>
          <Text style={styles.playAgainText}>🔁 Play Again</Text>
        </Pressable>
      )}
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
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  xp: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
    color: "#444",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  box: {
    width: 50,
    height: 50,
    margin: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  boxText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
  },
  keyboard: {
    marginTop: 20,
    alignItems: "center",
  },
  keyboardRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
  },
  keyButton: {
    backgroundColor: "#eeeeee",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#000",
    minWidth: 35,
    alignItems: "center",
  },
  keyText: {
    fontWeight: "bold",
  },
  reveal: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 16,
    color: "#555",
  },
  revealWord: {
    fontWeight: "bold",
    color: "#d32f2f",
  },
  congrats: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    color: "#2e7d32",
  },
  congratsWord: {
    fontWeight: "bold",
    color: "#1b5e20",
  },
  playAgainButton: {
    marginTop: 20,
    backgroundColor: "#1976d2",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "center",
  },
  playAgainText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  hintButton: {
    backgroundColor: "#fdd835",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 10,
  },
  hintText: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 16,
  },
  hintMessage: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 16,
    color: "#6a1b9a",
    fontWeight: "500",
  },
});
