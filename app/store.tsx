import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const frames = [
  {
    id: "frame1",
    name: "Gold Frame",
    cost: 50,
    image: { uri: "https://via.placeholder.com/100x100.png?text=Gold" },
  },
  {
    id: "frame2",
    name: "Crystal Frame",
    cost: 75,
    image: { uri: "https://via.placeholder.com/100x100.png?text=Crystal" },
  },
  {
    id: "frame3",
    name: "Flame Frame",
    cost: 100,
    image: { uri: "https://via.placeholder.com/100x100.png?text=Flame" },
  },
];

export default function StoreScreen() {
  const router = useRouter();
  const [mana, setMana] = useState(0);
  const [purchased, setPurchased] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      const savedMana = await AsyncStorage.getItem("mana");
      const savedPurchased = await AsyncStorage.getItem("purchasedFrames");
      setMana(savedMana ? parseInt(savedMana, 10) : 0);
      setPurchased(savedPurchased ? JSON.parse(savedPurchased) : []);
    };
    load();
  }, []);

  const purchase = async (frameId: string, cost: number) => {
    if (purchased.includes(frameId)) {
      Alert.alert("Already owned", "You already purchased this frame.");
      return;
    }

    if (mana < cost) {
      Alert.alert("Not enough Mana", `You need ${cost} mana to buy this frame.`);
      return;
    }

    const updated = [...purchased, frameId];
    const remainingMana = mana - cost;
    setPurchased(updated);
    setMana(remainingMana);
    await AsyncStorage.setItem("purchasedFrames", JSON.stringify(updated));
    await AsyncStorage.setItem("mana", remainingMana.toString());
    Alert.alert("Success", `Purchased ${frameId}!`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable onPress={() => router.back()} style={{ marginBottom: 20 }}>
        <Text style={{ color: "blue" }}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>Store 🛒</Text>
      <Text style={styles.manaText}>💠 Mana: {mana}</Text>

      {frames.map((frame) => (
        <View key={frame.id} style={styles.card}>
          <Image source={frame.image} style={styles.image} />
          <Text style={styles.name}>{frame.name}</Text>
          <Text style={styles.price}>Cost: {frame.cost} 💠</Text>

          {purchased.includes(frame.id) ? (
            <Text style={{ color: "green", marginTop: 8 }}>✅ Owned</Text>
          ) : (
            <Pressable
              style={styles.buyButton}
              onPress={() => purchase(frame.id, frame.cost)}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Buy</Text>
            </Pressable>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f4f4f5",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  manaText: {
    fontSize: 16,
    marginBottom: 20,
  },
  card: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  price: {
    fontSize: 14,
    color: "#555",
  },
  buyButton: {
    marginTop: 10,
    backgroundColor: "#1976d2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});
