import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EMOJIS = ["🐶", "🐱", "🦊", "🐻", "🐼", "🐸", "🐵", "🦁"];

const shuffleArray = (array: any[]) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export default function MemoryMatch() {
  const [cards, setCards] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [xp, setXp] = useState(0);
  const [hintCount, setHintCount] = useState<number>(3);

  useEffect(() => {
    const loadData = async () => {
      const xpVal = await AsyncStorage.getItem("xp");
      setXp(xpVal ? parseInt(xpVal) : 0);

      const hints = await AsyncStorage.getItem("hintCount");
      setHintCount(hints ? parseInt(hints) : 3);
    };

    loadData();
    resetGame();
  }, []);

  const resetGame = () => {
    const shuffled = shuffleArray([...EMOJIS, ...EMOJIS]).map((emoji, index) => ({
      id: index,
      emoji,
      flipped: false,
      matched: false,
    }));
    setCards(shuffled);
    setMoves(0);
    setSelected([]);
  };

  const handlePress = (index: number) => {
    if (cards[index].flipped || cards[index].matched || selected.length === 2) return;

    const updated = [...cards];
    updated[index].flipped = true;
    const newSelected = [...selected, index];
    setCards(updated);
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newSelected;
      if (updated[first].emoji === updated[second].emoji) {
        updated[first].matched = true;
        updated[second].matched = true;
        setCards(updated);
        setSelected([]);
        if (updated.every((c) => c.matched)) {
          addXP(50);
          Alert.alert("🎉 You won!", `Completed in ${moves + 1} moves. +50 XP`);
        }
      } else {
        setTimeout(() => {
          updated[first].flipped = false;
          updated[second].flipped = false;
          setCards([...updated]);
          setSelected([]);
        }, 1000);
      }
    }
  };

  const addXP = async (amount: number) => {
    const newXP = xp + amount;
    setXp(newXP);
    await AsyncStorage.setItem("xp", newXP.toString());
  };

  const useHint = async () => {
    if (hintCount <= 0) return Alert.alert("No hints left!");
    const unmatched = cards.filter((card) => !card.matched && !card.flipped);
    const seen: { [emoji: string]: number[] } = {};

    unmatched.forEach((card) => {
      if (!seen[card.emoji]) seen[card.emoji] = [];
      seen[card.emoji].push(card.id);
    });

    const pair = Object.values(seen).find((ids) => ids.length === 2);
    if (!pair) return Alert.alert("No hintable pairs found");

    const updated = [...cards];
    updated[pair[0]].flipped = true;
    updated[pair[1]].flipped = true;
    setCards(updated);

    const newHintCount = hintCount - 1;
    setHintCount(newHintCount);
    await AsyncStorage.setItem("hintCount", newHintCount.toString());
  };

  const renderCard = ({ item, index }: any) => (
    <Pressable
      onPress={() => handlePress(index)}
      style={[styles.card, item.flipped || item.matched ? styles.flipped : styles.hidden]}
    >
      <Text style={styles.emoji}>{item.flipped || item.matched ? item.emoji : "❓"}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧠 Memory Match</Text>
      <Text style={styles.subtitle}>Moves: {moves} | XP: {xp} | Hints: {hintCount}</Text>

      <FlatList
        data={cards}
        renderItem={renderCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={4}
        scrollEnabled={false}
        contentContainerStyle={styles.grid}
      />

      <Pressable style={styles.hintButton} onPress={useHint}>
        <Text style={styles.hintText}>🧠 Use Hint</Text>
      </Pressable>

      <Pressable style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetText}>🔁 Restart</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: "#555",
  },
  grid: {
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: 60,
    height: 60,
    margin: 8,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  hidden: {
    backgroundColor: "#ccc",
  },
  flipped: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#888",
  },
  emoji: {
    fontSize: 28,
  },
  hintButton: {
    backgroundColor: "#fdd835",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
  },
  hintText: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: "#1976d2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  resetText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
