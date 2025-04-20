import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Alert,
  StyleSheet,
  ImageBackground,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../components/CustomButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMusic } from "../components/MusicContext";

// Map of available frames
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
    <ImageBackground
      source={require("../assets/images/TestBGImage.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile + XP Header */}
        <View style={styles.profileHeader}>
          <Pressable onPress={pickImage}>
            <View style={styles.frameContainer}>
              {selectedFrame && frameMap[selectedFrame] && (
                <Image source={{ uri: frameMap[selectedFrame] }} style={styles.frame} />
              )}
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profilePic} />
              ) : (
                <MaterialCommunityIcons name="account-circle" size={70} color="#555" />
              )}
            </View>
          </Pressable>

          <View style={styles.stats}>
            <Text style={styles.level}>Level {level}</Text>
            <Text style={styles.xpText}>XP: {xp % xpPerLevel} / {xpPerLevel}</Text>
            <View style={styles.xpBarBackground}>
              <View
                style={[
                  styles.xpBar,
                  { width: `${((xp % xpPerLevel) / xpPerLevel) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.mana}>🪄 Mana: {mana}</Text>
          </View>
        </View>

        <Text style={styles.title}>Mind Glance 🧠</Text>
        <Text style={styles.subtitle}>Your mental wellness companion</Text>

        {/* Navigation Buttons */}
        <View style={styles.buttonGrid}>
          <CustomButton title="Games" href="/games" icon="gamepad-variant" />
          <CustomButton title="To Do" href="/todo" icon="format-list-checks" />
          <CustomButton title="Activity Tracker" href="/emotion-scan" icon="heart-pulse" />
          <CustomButton title="Journal" href="/journal" icon="book-open" />
          <CustomButton title="Store" href="/store" icon="shopping" />
          <CustomButton title="Options" href="/options" icon="cog" />
        </View>

        {/* Music Toggle */}
        <Pressable onPress={toggle} style={styles.playButton}>
          <Text style={styles.playButtonText}>
            {isPlaying ? "🔊 Pause Music" : "🎵 Play Music"}
          </Text>
        </Pressable>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 30,
  },
  frameContainer: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  profilePic: {
    width: 70,
    height: 70,
    borderRadius: 35,
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
  stats: {
    flex: 1,
  },
  level: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  xpText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  xpBarBackground: {
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 8,
  },
  xpBar: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
  mana: {
    fontSize: 14,
    color: "#000",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 6,
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
    rowGap: 24,
  },
  playButton: {
    marginTop: 40,
    backgroundColor: "#1976d2",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  playButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
