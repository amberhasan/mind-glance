import { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../constants/styles";

const moodOptions = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😡", label: "Angry" },
  { emoji: "😌", label: "Calm" },
  { emoji: "😰", label: "Anxious" },
];

export default function EmotionScanScreen() {
  const [activity, setActivity] = useState("");
  const [selectedMood, setSelectedMood] = useState(null);
  const [longTermGood, setLongTermGood] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [viewingEntry, setViewingEntry] = useState(null);
  const [loading, setLoading] = useState(false);

  const dummyActivities = [
    {
      date: "4/13/2025",
      activity: "Walked in the park",
      mood: "😊",
      longTerm: true,
    },
    { date: "4/12/2025", activity: "Did homework", mood: "😔", longTerm: true },
    { date: "4/11/2025", activity: "Played piano", mood: "😌", longTerm: true },
  ];

  useEffect(() => {
    loadActivities();
  }, []);

  async function loadActivities() {
    try {
      const stored = await AsyncStorage.getItem("activityLogs");
      if (stored) {
        setActivityLogs(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load activities:", error);
    }
  }

  async function handleSave() {
    if (!activity || !selectedMood || longTermGood === null) {
      Alert.alert("Missing Info", "Please fill out all fields.");
      return;
    }

    setLoading(true);

    try {
      const today = new Date();
      const formattedDate = today.toLocaleDateString(undefined, {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });

      const newLog = {
        date: formattedDate,
        activity: activity.trim(),
        mood: selectedMood.emoji,
        longTerm: longTermGood,
      };

      const updatedLogs = [newLog, ...activityLogs];
      setActivityLogs(updatedLogs);
      await AsyncStorage.setItem("activityLogs", JSON.stringify(updatedLogs));

      setActivity("");
      setSelectedMood(null);
      setLongTermGood(null);
      setShowNewEntry(false);
      Alert.alert("Saved!", "Your activity was saved successfully.");
    } catch (error) {
      console.error("Error saving activity:", error);
      Alert.alert("Error", "Failed to save your activity.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f7f7f8" }}>
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          paddingTop: 20,
          paddingBottom: 80,
        }}
      >
        <Text style={[styles.title, { marginBottom: 20 }]}>
          Activity Tracker 🏃🏼‍♂️
        </Text>

        {/* Not adding and not viewing */}
        {!showNewEntry && !viewingEntry && (
          <>
            {[...activityLogs, ...dummyActivities].map((log, index) => (
              <Pressable
                key={index}
                onPress={() => setViewingEntry(log)}
                style={{
                  backgroundColor: "#e2e8f0",
                  padding: 20,
                  borderRadius: 16,
                  marginBottom: 15,
                  width: "90%",
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                  elevation: 4,
                }}
              >
                <Text
                  style={{ fontWeight: "bold", fontSize: 16, marginBottom: 5 }}
                >
                  {log.date} {log.mood}
                </Text>
                <Text numberOfLines={1} style={{ color: "#555", fontSize: 14 }}>
                  {log.activity}
                </Text>
              </Pressable>
            ))}

            <Pressable
              style={{
                backgroundColor: "#6366f1",
                paddingVertical: 18,
                borderRadius: 16,
                width: "90%",
                marginTop: 30,
              }}
              onPress={() => setShowNewEntry(true)}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                + Add Activity
              </Text>
            </Pressable>
          </>
        )}

        {/* Viewing a past entry */}
        {viewingEntry && (
          <>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}
            >
              {viewingEntry.date} {viewingEntry.mood}
            </Text>
            <Text
              style={{
                backgroundColor: "#e2e8f0",
                padding: 20,
                borderRadius: 16,
                textAlignVertical: "top",
                minHeight: 120,
                marginBottom: 20,
                width: "90%",
              }}
            >
              {viewingEntry.activity}
            </Text>
            <Text style={{ fontSize: 16, marginBottom: 8 }}>
              Long-Term Benefit: {viewingEntry.longTerm ? "🌟 Yes" : "⚡ No"}
            </Text>

            <Pressable
              style={{
                backgroundColor: "#94a3b8",
                paddingVertical: 14,
                borderRadius: 16,
                width: "90%",
                marginTop: 30,
              }}
              onPress={() => setViewingEntry(null)}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                ← Back
              </Text>
            </Pressable>
          </>
        )}

        {/* Adding a new entry */}
        {showNewEntry && (
          <>
            <TextInput
              style={{
                backgroundColor: "#e2e8f0",
                borderRadius: 16,
                padding: 20,
                width: "90%",
                minHeight: 120,
                textAlignVertical: "top",
                marginBottom: 20,
                fontSize: 16,
              }}
              value={activity}
              onChangeText={setActivity}
              placeholder="What did you do?"
              multiline
            />

            <Text style={{ marginBottom: 10, fontSize: 16 }}>
              Mood after activity:
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginBottom: 20,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {moodOptions.map((mood, index) => (
                <Pressable
                  key={index}
                  onPress={() => setSelectedMood(mood)}
                  style={{
                    backgroundColor:
                      selectedMood?.label === mood.label
                        ? "#c7d2fe"
                        : "#f0f0f0",
                    padding: 12,
                    margin: 6,
                    borderRadius: 12,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 30 }}>{mood.emoji}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={{ marginBottom: 10, fontSize: 16 }}>
              Was this good long-term?
            </Text>
            <View style={{ flexDirection: "row", marginBottom: 30 }}>
              <Pressable
                onPress={() => setLongTermGood(true)}
                style={{
                  backgroundColor:
                    longTermGood === true ? "#4ade80" : "#f0f0f0",
                  padding: 12,
                  marginHorizontal: 10,
                  borderRadius: 12,
                  width: 100,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>✅ Yes</Text>
              </Pressable>
              <Pressable
                onPress={() => setLongTermGood(false)}
                style={{
                  backgroundColor:
                    longTermGood === false ? "#f87171" : "#f0f0f0",
                  padding: 12,
                  marginHorizontal: 10,
                  borderRadius: 12,
                  width: 100,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>❌ No</Text>
              </Pressable>
            </View>

            <Pressable
              onPress={handleSave}
              style={{
                backgroundColor: "#4f46e5",
                paddingVertical: 18,
                borderRadius: 16,
                width: "90%",
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                Save Activity
              </Text>
            </Pressable>

            {loading && (
              <ActivityIndicator
                size="large"
                color="#6366f1"
                style={{ marginVertical: 20 }}
              />
            )}

            <Pressable
              style={{
                backgroundColor: "#94a3b8",
                paddingVertical: 14,
                borderRadius: 16,
                width: "90%",
                marginTop: 30,
              }}
              onPress={() => setShowNewEntry(false)}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                ← Cancel
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
