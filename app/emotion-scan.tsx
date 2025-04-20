import { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { styles } from "../constants/styles";
import { useRouter } from "expo-router";

// Mood options
const moodOptions = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😡", label: "Angry" },
  { emoji: "😌", label: "Calm" },
  { emoji: "😰", label: "Anxious" },
];

export default function EmotionScanScreen() {
  const router = useRouter();
  const [activity, setActivity] = useState("");
  const [selectedMood, setSelectedMood] = useState(null);

  function handleSave() {
    if (!activity || !selectedMood) {
      Alert.alert("Error", "Please enter an activity and select a mood.");
      return;
    }

    console.log("Logged activity:", {
      activity,
      mood: selectedMood.label,
    });

    Alert.alert("Saved", "Your activity was logged successfully!");
    setActivity("");
    setSelectedMood(null);
  }

  return (
    <SafeAreaView
      style={[styles.container, { paddingTop: 20, alignItems: "center" }]}
    >
      <Text style={styles.title}>Activity Tracker 🏃🏼‍♂️</Text>

      <Text style={{ marginBottom: 5, marginTop: 10 }}>What did you do?</Text>
      <TextInput
        value={activity}
        onChangeText={setActivity}
        placeholder="e.g., Took a walk, Played guitar"
        style={{
          height: 50,
          width: "90%",
          backgroundColor: "#f0f0f0",
          paddingHorizontal: 10,
          borderRadius: 10,
          marginBottom: 15,
        }}
      />

      <Text style={{ marginBottom: 10 }}>How do you feel after?</Text>

      {/* Mood selection row */}
      <View style={{ flexDirection: "row", marginBottom: 30 }}>
        {moodOptions.map((mood, index) => (
          <Pressable
            key={index}
            onPress={() => setSelectedMood(mood)}
            style={{
              backgroundColor:
                selectedMood?.label === mood.label ? "#cce5ff" : "#f0f0f0",
              padding: 10,
              marginHorizontal: 5,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 30 }}>{mood.emoji}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={handleSave}
        style={{
          backgroundColor: "blue",
          padding: 15,
          borderRadius: 10,
          width: "90%",
          marginTop: 10,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Save Activity
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
