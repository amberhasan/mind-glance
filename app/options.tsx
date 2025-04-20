import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Alert,
  StyleSheet,
  Switch,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useMusic } from "../components/MusicContext"; // ✅ ADDED

const frameOptions = [
  {
    id: "frame1",
    name: "Glacier Frame",
    image: {
      uri: "https://github.com/amberhasan/mind-glance/blob/main/assets/images/frames3.png?raw=true",
    },
  },
  {
    id: "frame2",
    name: "Abstract Flower Frame",
    image: {
      uri: "https://github.com/amberhasan/mind-glance/blob/main/assets/images/frames4.png?raw=true",
    },
  },
  {
    id: "frame3",
    name: "HackAI Frame",
    image: {
      uri: "https://github.com/amberhasan/mind-glance/blob/main/assets/images/frames6.png?raw=true",
    },
  },
  {
    id: "frame4",
    name: "NRVE Frame",
    image: {
      uri: "https://github.com/amberhasan/mind-glance/blob/main/assets/images/frames7.png?raw=true",
    },
  },
];

const musicTracks = [
  {
    id: "calm",
    name: "Serenity",
    preview: "https://github.com/amberhasan/mind-glance/blob/main/assets/music/Ambient__BPM120.mp3?raw=true",
  },
  {
    id: "retro",
    name: "Exploration",
    preview: "https://github.com/amberhasan/mind-glance/blob/main/assets/music/Ambient__BPM98.mp3?raw=true",
  },
  {
    id: "nature",
    name: "Galaxy",
    preview: "https://github.com/amberhasan/mind-glance/blob/main/assets/music/Ambient__BPM72.mp3?raw=true",
  },
];

export default function OptionsScreen() {
  const router = useRouter();
  const { playNewTrack } = useMusic(); // ✅ ADDED
  const [purchasedFrames, setPurchasedFrames] = useState<string[]>([]);
  const [ownedFrames, setOwnedFrames] = useState<string[]>([]);
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
  const [purchasedTracks, setPurchasedTracks] = useState<string[]>([]);
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null);
  const [devMode, setDevMode] = useState(false);
  const [xpInput, setXpInput] = useState("");
  const [manaInput, setManaInput] = useState("");
  const [hintInput, setHintInput] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const savedPurchased = await AsyncStorage.getItem("purchasedFrames");
      const savedSelected = await AsyncStorage.getItem("selectedFrame");
      const savedDev = await AsyncStorage.getItem("devMode");
      const savedTracks = await AsyncStorage.getItem("purchasedTracks");
      const savedMusic = await AsyncStorage.getItem("selectedMusic");

      setPurchasedFrames(savedPurchased ? JSON.parse(savedPurchased) : []);
      setOwnedFrames(savedPurchased ? JSON.parse(savedPurchased) : []);
      setPurchasedTracks(savedTracks ? JSON.parse(savedTracks) : []);
      setSelectedFrame(savedSelected || null);
      setSelectedMusic(savedMusic || null);
      setDevMode(savedDev === "true");
    };
    loadData();
  }, []);

  const handleSelectFrame = async (id: string) => {
    setSelectedFrame(id);
    await AsyncStorage.setItem("selectedFrame", id);
    Alert.alert("Updated", "Your frame has been equipped!");
  };

  const handleSelectMusic = async (id: string) => {
    setSelectedMusic(id);
    await playNewTrack(id); // ✅ This replaces AsyncStorage directly
    Alert.alert("Updated", "Background music has been changed!");
  };

  const toggleDevMode = async () => {
    const newState = !devMode;
    setDevMode(newState);
    await AsyncStorage.setItem("devMode", newState.toString());
    if (!newState) {
      setOwnedFrames(purchasedFrames);
    } else {
      setOwnedFrames(frameOptions.map((f) => f.id));
    }
  };

  const giveAllFrames = async () => {
    const allIds = frameOptions.map((f) => f.id);
    setOwnedFrames(allIds);
    Alert.alert("All Frames", "You now own all frames temporarily.");
  };

  const buyFrame = async () => {
    router.push("/store");
  };

  const clearFrames = async () => {
    setPurchasedFrames([]);
    setOwnedFrames(devMode ? frameOptions.map((f) => f.id) : []);
    await AsyncStorage.removeItem("purchasedFrames");
    Alert.alert("Cleared", "You have removed all your frames.");
  };

  const updateXP = async () => {
    await AsyncStorage.setItem("xp", xpInput || "0");
    Alert.alert("XP Updated", `XP set to ${xpInput || 0}`);
  };

  const updateMana = async () => {
    await AsyncStorage.setItem("mana", manaInput || "0");
    Alert.alert("Mana Updated", `Mana set to ${manaInput || 0}`);
  };

  const updateHints = async () => {
    await AsyncStorage.setItem("hintCount", hintInput || "0");
    Alert.alert("Hints Updated", `Hints set to ${hintInput || 0}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Options ⚙️</Text>
      <Text style={styles.subtitle}>Choose your profile frame:</Text>

      {frameOptions.map((frame) => (
        <View
          key={frame.id}
          style={[
            styles.card,
            selectedFrame === frame.id && {
              borderColor: "#4caf50",
              borderWidth: 2,
            },
          ]}
        >
          <Image source={frame.image} style={styles.image} />
          <Text style={styles.name}>{frame.name}</Text>

          {!purchasedFrames.includes(frame.id) ? (
            <Pressable onPress={buyFrame} style={styles.buyButton}>
              <Text style={styles.buyText}>Buy</Text>
            </Pressable>
          ) : selectedFrame === frame.id ? (
            <Text style={styles.status}>✅ Equipped</Text>
          ) : (
            <Pressable onPress={() => handleSelectFrame(frame.id)} style={styles.buyButton}>
              <Text style={styles.buyText}>Equip</Text>
            </Pressable>
          )}
        </View>
      ))}

      <Text style={styles.subtitle}>Select Background Music 🎵</Text>

      {musicTracks.map((track) => {
        if (!purchasedTracks.includes(track.id)) return null;

        return (
          <View
            key={track.id}
            style={[
              styles.card,
              selectedMusic === track.id && {
                borderColor: "#4caf50",
                borderWidth: 2,
              },
            ]}
          >
            <Text style={styles.name}>{track.name}</Text>
            {selectedMusic === track.id ? (
              <Text style={styles.status}>✅ Equipped</Text>
            ) : (
              <Pressable onPress={() => handleSelectMusic(track.id)} style={styles.buyButton}>
                <Text style={styles.buyText}>Equip</Text>
              </Pressable>
            )}
          </View>
        );
      })}

      <View style={styles.devToggle}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>Dev Mode</Text>
        <Switch value={devMode} onValueChange={toggleDevMode} />
      </View>

      {devMode && (
        <View style={styles.devTools}>
          <Text style={styles.subtitle}>🛠 Developer Tools</Text>

          <Pressable onPress={giveAllFrames} style={styles.devButton}>
            <Text style={styles.devButtonText}>Unlock All Frames</Text>
          </Pressable>

          <Pressable onPress={clearFrames} style={styles.devButton}>
            <Text style={styles.devButtonText}>❌ Remove All Purchased Frames</Text>
          </Pressable>

          <View style={styles.inputGroup}>
            <Text>XP:</Text>
            <TextInput
              style={styles.input}
              value={xpInput}
              onChangeText={setXpInput}
              keyboardType="numeric"
              placeholder="Enter XP"
            />
            <Pressable onPress={updateXP} style={styles.smallButton}>
              <Text style={styles.devButtonText}>Set</Text>
            </Pressable>
          </View>

          <View style={styles.inputGroup}>
            <Text>Mana:</Text>
            <TextInput
              style={styles.input}
              value={manaInput}
              onChangeText={setManaInput}
              keyboardType="numeric"
              placeholder="Enter Mana"
            />
            <Pressable onPress={updateMana} style={styles.smallButton}>
              <Text style={styles.devButtonText}>Set</Text>
            </Pressable>
          </View>

          <View style={styles.inputGroup}>
            <Text>Hints:</Text>
            <TextInput
              style={styles.input}
              value={hintInput}
              onChangeText={setHintInput}
              keyboardType="numeric"
              placeholder="Enter Hint Count"
            />
            <Pressable onPress={updateHints} style={styles.smallButton}>
              <Text style={styles.devButtonText}>Set</Text>
            </Pressable>
          </View>
        </View>
      )}
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
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 12,
    resizeMode: "contain",
  },
  name: {
    fontSize: 16,
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    color: "#333",
  },
  buyButton: {
    backgroundColor: "#1976d2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 8,
  },
  buyText: {
    color: "#fff",
    fontWeight: "bold",
  },
  devToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 10,
    width: "90%",
  },
  devTools: {
    width: "90%",
    marginTop: 10,
  },
  devButton: {
    backgroundColor: "#444",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  devButtonText: {
    color: "white",
    textAlign: "center",
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  input: {
    borderColor: "#aaa",
    borderWidth: 1,
    padding: 8,
    borderRadius: 6,
    flex: 1,
    backgroundColor: "#fff",
  },
  smallButton: {
    backgroundColor: "#333",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
});
