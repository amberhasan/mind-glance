import React, { useEffect, useState, useRef } from "react";
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
import { Audio } from "expo-av";

const frames = [
  {
    id: "frame1",
    name: "Glacier Frame",
    cost: 50,
    image: {
      uri: "https://github.com/amberhasan/mind-glance/blob/main/assets/images/frames3.png?raw=true",
    },
  },
  {
    id: "frame2",
    name: "Abstract Flower Frame",
    cost: 75,
    image: {
      uri: "https://github.com/amberhasan/mind-glance/blob/main/assets/images/frames4.png?raw=true",
    },
  },
  {
    id: "frame3",
    name: "HackAI Frame",
    cost: 100,
    image: {
      uri: "https://github.com/amberhasan/mind-glance/blob/main/assets/images/frames6.png?raw=true",
    },
  },
  {
    id: "frame4",
    name: "NRVE Frame",
    cost: 125,
    image: {
      uri: "https://github.com/amberhasan/mind-glance/blob/main/assets/images/frames7.png?raw=true",
    },
  },
];

const hintOptions = [
  { id: "hint1", label: "+1 Hint", cost: 30, amount: 1 },
  { id: "hint3", label: "+3 Hints", cost: 80, amount: 3 },
  { id: "hint5", label: "+5 Hints", cost: 120, amount: 5 },
];

const musicTracks = [
  {
    id: "calm",
    name: "Serenity",
    cost: 60,
    preview:
      "https://github.com/amberhasan/mind-glance/blob/main/assets/music/Ambient__BPM120.mp3?raw=true",
  },
  {
    id: "retro",
    name: "Exploration",
    cost: 60,
    preview:
      "https://github.com/amberhasan/mind-glance/blob/main/assets/music/Ambient__BPM98.mp3?raw=true",
  },
  {
    id: "nature",
    name: "Galaxy",
    cost: 60,
    preview:
      "https://github.com/amberhasan/mind-glance/blob/main/assets/music/Ambient__BPM72.mp3?raw=true",
  },
];

export default function StoreScreen() {
  const router = useRouter();
  const [mana, setMana] = useState(0);
  const [purchasedFrames, setPurchasedFrames] = useState<string[]>([]);
  const [purchasedTracks, setPurchasedTracks] = useState<string[]>([]);
  const sound = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    const load = async () => {
      const savedMana = await AsyncStorage.getItem("mana");
      const savedFrames = await AsyncStorage.getItem("purchasedFrames");
      const savedTracks = await AsyncStorage.getItem("purchasedTracks");
      setMana(savedMana ? parseInt(savedMana, 10) : 0);
      setPurchasedFrames(savedFrames ? JSON.parse(savedFrames) : []);
      setPurchasedTracks(savedTracks ? JSON.parse(savedTracks) : []);
    };
    load();

    return () => {
      if (sound.current) {
        sound.current.unloadAsync();
      }
    };
  }, []);

  const updateMana = async (newMana: number) => {
    setMana(newMana);
    await AsyncStorage.setItem("mana", newMana.toString());
  };

  const buyItem = async (
    type: string,
    id: string,
    cost: number,
    extra?: any
  ) => {
    if (mana < cost) return Alert.alert("Insufficient Mana");

    if (type === "frame") {
      if (purchasedFrames.includes(id)) return Alert.alert("Already owned");
      const updated = [...purchasedFrames, id];
      setPurchasedFrames(updated);
      await AsyncStorage.setItem("purchasedFrames", JSON.stringify(updated));
    } else if (type === "hint") {
      const existing = await AsyncStorage.getItem("hintCount");
      const current = existing ? parseInt(existing) : 0;
      const updatedHint = current + (extra?.amount || 0);
      await AsyncStorage.setItem("hintCount", updatedHint.toString());
    } else if (type === "music") {
      if (purchasedTracks.includes(id)) return Alert.alert("Already owned");
      const updated = [...purchasedTracks, id];
      setPurchasedTracks(updated);
      await AsyncStorage.setItem("purchasedTracks", JSON.stringify(updated));
    }

    updateMana(mana - cost);
    Alert.alert("Purchased!", `You purchased ${id}`);
  };

  const previewTrack = async (uri: string) => {
    if (sound.current) {
      await sound.current.stopAsync();
      await sound.current.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync({ uri });
    sound.current = newSound;
    await newSound.playAsync();
    setTimeout(async () => {
      await newSound.stopAsync();
    }, 5000);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🛒 Store</Text>
      <Text style={styles.mana}>💠 Mana: {mana}</Text>

      {/* FRAME SHOP */}
      <View style={styles.sectionBox}>
        <Text style={styles.section}>🖼 Frames</Text>
        {frames.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <Text>
              {item.name} - {item.cost}💠
            </Text>
            {purchasedFrames.includes(item.id) ? (
              <Text style={{ color: "green" }}>✅ Owned</Text>
            ) : (
              <Pressable
                style={styles.buyButton}
                onPress={() => buyItem("frame", item.id, item.cost)}
              >
                <Text style={styles.buyText}>Buy</Text>
              </Pressable>
            )}
          </View>
        ))}
      </View>

      {/* HINT SHOP */}
      <View style={styles.sectionBox}>
        <Text style={styles.section}>💡 Hints</Text>
        {hintOptions.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text>
              {item.label} - {item.cost}💠
            </Text>
            <Pressable
              style={styles.buyButton}
              onPress={() => buyItem("hint", item.id, item.cost, item)}
            >
              <Text style={styles.buyText}>Buy</Text>
            </Pressable>
          </View>
        ))}
      </View>

      {/* MUSIC SHOP */}
      <View style={styles.sectionBox}>
        <Text style={styles.section}>🎵 Music Tracks</Text>
        {musicTracks.map((track) => (
          <View key={track.id} style={styles.card}>
            <Text>
              {track.name} - {track.cost}💠
            </Text>
            <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
              <Pressable
                style={styles.previewButton}
                onPress={() => previewTrack(track.preview)}
              >
                <Text style={styles.buyText}>▶️ Preview</Text>
              </Pressable>
              {purchasedTracks.includes(track.id) ? (
                <Text style={{ color: "green", alignSelf: "center" }}>
                  ✅ Owned
                </Text>
              ) : (
                <Pressable
                  style={styles.buyButton}
                  onPress={() => buyItem("music", track.id, track.cost)}
                >
                  <Text style={styles.buyText}>Buy</Text>
                </Pressable>
              )}
            </View>
          </View>
        ))}
      </View>
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
  mana: {
    fontSize: 16,
    marginBottom: 20,
  },
  sectionBox: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  section: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 6,
  },
  card: {
    width: "100%",
    backgroundColor: "#fefefe",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
    resizeMode: "contain",
  },
  buyButton: {
    backgroundColor: "#1976d2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 8,
  },
  previewButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buyText: {
    color: "white",
    fontWeight: "bold",
  },
});
