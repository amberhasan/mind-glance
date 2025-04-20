import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../components/CustomButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMusic } from "../components/MusicContext";

const frameMap: { [key: string]: string } = {
  frame1: "https://github.com/amberhasan/mind-glance/blob/main/assets/images/frames3.png?raw=true",
  frame2: "https://github.com/amberhasan/mind-glance/blob/main/assets/images/frames4.png?raw=true",
  frame3: "https://github.com/amberhasan/mind-glance/blob/main/assets/images/frames6.png?raw=true",
  frame4: "https://github.com/amberhasan/mind-glance/blob/main/assets/images/frames7.png?raw=true",
};

export default function HomeScreen() {
  const [xp, setXp] = useState(0);
  const [mana, setMana] = useState(0);
  const [level, setLevel] = useState(1);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);

  const { isPlaying, toggle } = useMusic();
  const xpPerLevel = 100;

  useEffect(() => {
    const load = async () => {
      const savedXP = await AsyncStorage.getItem("xp");
      const savedMana = await AsyncStorage.getItem("mana");
      const savedFrame = await AsyncStorage.getItem("selectedFrame");
      setXp(savedXP ? parseInt(savedXP, 10) : 0);
      setMana(savedMana ? parseInt(savedMana, 10) : 0);
      setSelectedFrame(savedFrame);
    };
    load();
  }, []);

  useEffect(() => {
    const newLevel = Math.floor(xp / xpPerLevel) + 1;
    if (newLevel > level) {
      const levelDiff = newLevel - level;
      setLevel(newLevel);
      setMana((prev) => {
        const updated = prev + levelDiff;
        AsyncStorage.setItem("mana", updated.toString());
        return updated;
      });
    }
  }, [xp]);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "We need media access to upload a profile picture.");
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert("Error", "Unable to select image.");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: 60,
        paddingHorizontal: 20,
        backgroundColor: "#f3f4f6",
        paddingBottom: 40,
      }}
    >
      {/* XP + Profile Header */}
      <View style={styles.headerContainer}>
        {/* XP + Level */}
        <View style={{ flex: 1, marginRight: 10 }}>
          <View style={styles.levelRow}>
            <Text style={styles.levelText}>Level {level}</Text>
            <Text style={styles.levelText}>
              XP: {xp % xpPerLevel} / {xpPerLevel}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={{
                width: `${((xp % xpPerLevel) / xpPerLevel) * 100}%`,
                height: "100%",
                backgroundColor: "#4CAF50",
              }}
            />
          </View>
        </View>

        {/* Profile Picture with Frame */}
        <Pressable onPress={pickImage}>
          <View style={styles.frameContainer}>
            {selectedFrame && frameMap[selectedFrame] && (
              <Image source={{ uri: frameMap[selectedFrame] }} style={styles.frame} />
            )}
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profilePic} />
            ) : (
              <MaterialCommunityIcons name="account-circle" size={60} color="#555" />
            )}
          </View>
        </Pressable>
      </View>

      {/* Mana */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Text style={{ fontSize: 16 }}>🪄 Mana: {mana}</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>Mind Glance 🧠</Text>
      <Text style={styles.subtitle}>Your mental wellness companion</Text>

      {/* Button Grid */}
      <View style={styles.buttonGrid}>
        <CustomButton title="Games" href="/games" icon="gamepad-variant" />
        <CustomButton title="To Do" href="/todo" icon="format-list-checks" />
        <CustomButton title="Activity Tracker" href="/emotion-scan" icon="heart-pulse" />
        <CustomButton title="Journal" href="/journal" icon="book-open" />
        <CustomButton title="Store" href="/store" icon="shopping" />
        <CustomButton title="Options" href="/options" icon="cog" />
      </View>

      {/* Music Button at Bottom */}
      <View style={{ alignItems: "center", marginTop: 40 }}>
        <Pressable
          onPress={toggle}
          style={{
            marginTop: 10,
            paddingHorizontal: 16,
            paddingVertical: 10,
            backgroundColor: "#1976d2",
            borderRadius: 6,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            {isPlaying ? "🔊 Pause Music" : "🎵 Play Music"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  levelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  levelText: {
    fontSize: 14,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
  },
  frameContainer: {
    width: 100,
    height: 100,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    zIndex: 1,
  },
  frame: {
    width: 100,
    height: 100,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
  },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
  },
});
