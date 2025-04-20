import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../components/CustomButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMusic } from "../components/MusicContext"; // ✅ Music Context

export default function HomeScreen() {
  const [xp, setXp] = useState(0);
  const [mana, setMana] = useState(0);
  const [level, setLevel] = useState(1);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const { isPlaying, toggle } = useMusic(); // ✅ useMusic hook
  const xpPerLevel = 100;

  useEffect(() => {
    const load = async () => {
      const savedXP = await AsyncStorage.getItem("xp");
      const savedMana = await AsyncStorage.getItem("mana");
      setXp(savedXP ? parseInt(savedXP, 10) : 0);
      setMana(savedMana ? parseInt(savedMana, 10) : 0);
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
      }}
    >
      {/* XP + Profile Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        {/* XP + Level */}
        <View style={{ flex: 1, marginRight: 10 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <Text style={{ fontSize: 14 }}>Level {level}</Text>
            <Text style={{ fontSize: 14 }}>
              XP: {xp % xpPerLevel} / {xpPerLevel}
            </Text>
          </View>
          <View
            style={{
              height: 10,
              backgroundColor: "#ddd",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: `${((xp % xpPerLevel) / xpPerLevel) * 100}%`,
                height: "100%",
                backgroundColor: "#4CAF50",
              }}
            />
          </View>
        </View>

        {/* Profile Picture */}
        <Pressable onPress={pickImage}>
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
          ) : (
            <MaterialCommunityIcons name="account-circle" size={40} color="#555" />
          )}
        </Pressable>
      </View>

      {/* Mana + Music Toggle */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Text style={{ fontSize: 16 }}>🪄 Mana: {mana}</Text>

        <Pressable
          onPress={toggle}
          style={{
            marginTop: 10,
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: "#1976d2",
            borderRadius: 6,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            {isPlaying ? "🔊 Pause Music" : "🎵 Play Music"}
          </Text>
        </Pressable>
      </View>

      {/* Title */}
      <Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 10,
        }}
      >
        Mind Glance 🧠
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: "#555",
          textAlign: "center",
          marginBottom: 30,
        }}
      >
        Your mental wellness companion
      </Text>

      {/* Button Grid */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <CustomButton title="Games" href="/games" icon="gamepad-variant" />
        <CustomButton title="To Do" href="/todo" icon="format-list-checks" />
        <CustomButton title="Activity Tracker" href="/emotion-scan" icon="heart-pulse" />
        <CustomButton title="Journal" href="/journal" icon="book-open" />
        <CustomButton title="Store" href="/store" icon="shopping" />
        <CustomButton title="Options" href="/options" icon="cog" />
      </View>
    </ScrollView>
  );
}
