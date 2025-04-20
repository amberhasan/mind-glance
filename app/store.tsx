import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

// Placeholder frames for demo purposes
const frameOptions = [
  {
    id: "frame1",
    name: "Gold Frame",
    cost: 2,
    image: { uri: "https://via.placeholder.com/100x100.png?text=Gold" },
  },
  {
    id: "frame2",
    name: "Crystal Frame",
    cost: 3,
    image: { uri: "https://via.placeholder.com/100x100.png?text=Crystal" },
  },
  {
    id: "frame3",
    name: "Flame Frame",
    cost: 5,
    image: { uri: "https://via.placeholder.com/100x100.png?text=Flame" },
  },
];

export default function StoreScreen() {
  const router = useRouter();
  const [mana, setMana] = useState(0);
  const [ownedFrames, setOwnedFrames] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const savedMana = await AsyncStorage.getItem("mana");
      const savedFrames = await AsyncStorage.getItem("frames");
      const selectedFrame = await AsyncStorage.getItem("selectedFrame");
      setMana(savedMana ? parseInt(savedMana, 10) : 0);
      setOwnedFrames(savedFrames ? JSON.parse(savedFrames) : []);
      setSelected(selectedFrame);
    };
    load();
  }, []);

  const buyFrame = async (frameId: string, cost: number) => {
    if (ownedFrames.includes(frameId)) {
      return selectFrame(frameId);
    }

    if (mana < cost) {
      Alert.alert("Not enough Mana", "You need more Mana to buy this frame.");
      return;
    }

    const updatedMana = mana - cost;
    const updatedFrames = [...ownedFrames, frameId];

    setMana(updatedMana);
    setOwnedFrames(updatedFrames);
    await AsyncStorage.setItem("mana", updatedMana.toString());
    await AsyncStorage.setItem("frames", JSON.stringify(updatedFrames));
    selectFrame(frameId);
  };

  const selectFrame = async (frameId: string) => {
    setSelected(frameId);
    await AsyncStorage.setItem("selectedFrame", frameId);
    Alert.alert("Frame Selected", "Your new profile frame is active!");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <Pressable onPress={() => router.back()} style={{ marginBottom: 20 }}>
        <Text style={{ color: "blue" }}>← Back</Text>
      </Pressable>

      {/* Title */}
      <Text style={styles.title}>Store 🛒</Text>
      <Text style={styles.subtitle}>Mana: {mana}</Text>

      {frameOptions.map((frame) => (
        <Pressable
          key={frame.id}
          onPress={() => buyFrame(frame.id, frame.cost)}
          style={[
            styles.frameCard,
            selected === frame.id && {
              borderColor: "#4caf50",
              borderWidth: 2,
            },
          ]}
        >
          <Image source={frame.image} style={styles.frameImage} />
          <Text style={styles.frameText}>{frame.name}</Text>
          <Text style={styles.frameText}>
            {ownedFrames.includes(frame.id)
              ? selected === frame.id
                ? "✅ Selected"
                : "Tap to Select"
              : `💠 ${frame.cost} Mana`}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f4f4f5",
    minHeight: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#555",
  },
  frameCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
    elevation: 2,
  },
  frameImage: {
    width: 100,
    height: 100,
    marginBottom: 12,
    resizeMode: "contain",
  },
  frameText: {
    fontSize: 16,
    marginBottom: 4,
  },
});
