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

export default function HomeScreen() {
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const xpPerLevel = 100;
  const level = Math.floor(xp / xpPerLevel) + 1;
  const progress = xp % xpPerLevel;

  const getRank = (xp: number) => {
    if (xp < 100) return "🌱 Beginner";
    if (xp < 250) return "🎯 Intermediate";
    if (xp < 500) return "🚀 Advanced";
    return "👑 Expert";
  };

  const getBadges = (xp: number) => {
    const badges = [];
    if (xp >= 100) badges.push("🥉 Bronze");
    if (xp >= 250) badges.push("🥈 Silver");
    if (xp >= 500) badges.push("🥇 Gold");
    if (xp >= 1000) badges.push("🏆 Champion");
    return badges;
  };

  useEffect(() => {
    const loadData = async () => {
      const savedXP = await AsyncStorage.getItem("xp");
      const storedXP = savedXP ? parseInt(savedXP, 10) : 0;
      setXp(storedXP);

      const today = new Date().toDateString();
      const last = await AsyncStorage.getItem("lastPlayed");
      const storedStreak = await AsyncStorage.getItem("streak");

      if (!last) {
        await AsyncStorage.setItem("lastPlayed", today);
        await AsyncStorage.setItem("streak", "1");
        setStreak(1);
      } else if (last !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (last === yesterday.toDateString()) {
          const newStreak = parseInt(storedStreak || "0") + 1;
          await AsyncStorage.setItem("streak", newStreak.toString());
          setStreak(newStreak);
        } else {
          await AsyncStorage.setItem("streak", "1");
          setStreak(1);
        }

        await AsyncStorage.setItem("lastPlayed", today);
      } else {
        setStreak(parseInt(storedStreak || "1"));
      }
    };
    loadData();
  }, []);

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
      {/* Header: XP + Avatar */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        {/* XP Bar + Level */}
        <View style={{ flex: 1, marginRight: 10 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "600" }}>
              Level {level} - {getRank(xp)}
            </Text>
            <Text style={{ fontSize: 14 }}>
              XP: {progress} / {xpPerLevel}
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
                width: `${(progress / xpPerLevel) * 100}%`,
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
            <MaterialCommunityIcons
              name="account-circle"
              size={40}
              color="#555"
            />
          )}
        </Pressable>
      </View>

      {/* Streak & Badges */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Text style={{ fontSize: 16 }}>🔥 Streak: {streak} day{streak !== 1 ? "s" : ""}</Text>
        <View style={{ marginTop: 4 }}>
          {getBadges(xp).map((badge, idx) => (
            <Text key={idx} style={{ fontSize: 14 }}>{badge}</Text>
          ))}
        </View>
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
        <CustomButton title="Emotion Scan" href="/emotion-scan" icon="heart-pulse" />
        <CustomButton title="Journal" href="/journal" icon="book-open" />
        <CustomButton title="Store" href="/store" icon="shopping" />
        <CustomButton title="Options" href="/options" icon="cog" />
      </View>
    </ScrollView>
  );
}
