import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../constants/styles";

export default function JournalScreen() {
  const [entry, setEntry] = useState("");
  const [mood, setMood] = useState("");
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [viewingEntry, setViewingEntry] = useState(null);
  const [journalLogs, setJournalLogs] = useState([]); // real logs

  const dummyJournals = [
    { date: "4/13/2025", mood: "😊", text: "Today was a good day!" },
    { date: "4/12/2025", mood: "😔", text: "Feeling a bit down today." },
    { date: "4/11/2025", mood: "😌", text: "Peaceful and calm vibes." },
  ];

  useEffect(() => {
    loadJournals();
  }, []);

  async function loadJournals() {
    try {
      const stored = await AsyncStorage.getItem("journalLogs");
      if (stored) {
        setJournalLogs(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load journals", error);
    }
  }

  const getMoodEmoji = (mood) => {
    if (mood === "POSITIVE") return "😊";
    if (mood === "NEGATIVE") return "😞";
    return "😐"; // neutral/unknown
  };

  async function handleSave() {
    if (!entry.trim()) {
      Alert.alert("Entry is empty", "Please write something first.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: entry }),
      });

      const data = await response.json();
      const detectedMood = data.mood || "NEUTRAL";

      const today = new Date();
      const formattedDate = today.toLocaleDateString(undefined, {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });

      const newLog = {
        date: formattedDate,
        mood: detectedMood,
        text: entry.trim(),
      };

      const updatedLogs = [newLog, ...journalLogs];
      setJournalLogs(updatedLogs);
      await AsyncStorage.setItem("journalLogs", JSON.stringify(updatedLogs));

      console.log("Saved journal:", newLog);

      setEntry("");
      setMood("");
      setConfidence(null);
      setShowNewEntry(false);
      Alert.alert("Saved!", "Your journal entry was saved successfully.");
    } catch (error) {
      console.error("Error saving journal:", error);
      Alert.alert("Error", "Failed to save your journal entry.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { paddingBottom: 60 }]}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Journal 📓</Text>

        {/* If not writing a new one and not viewing old one */}
        {!showNewEntry && !viewingEntry && (
          <>
            {[...journalLogs, ...dummyJournals].length > 0 ? (
              [...journalLogs, ...dummyJournals].map((journal, index) => (
                <Pressable
                  key={index}
                  onPress={() => setViewingEntry(journal)}
                  style={{
                    backgroundColor: "#f0f0f0",
                    padding: 15,
                    borderRadius: 10,
                    marginBottom: 10,
                    width: "100%",
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>
                    {journal.date} Journal Entry {getMoodEmoji(journal.mood)}
                  </Text>
                </Pressable>
              ))
            ) : (
              <Text style={{ marginBottom: 20, color: "#555" }}>
                No journal entries yet.
              </Text>
            )}

            <Pressable
              style={{
                backgroundColor: "#4F46E5",
                padding: 15,
                borderRadius: 10,
                width: "100%",
                marginTop: 20,
              }}
              onPress={() => setShowNewEntry(true)}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                + Add Journal Entry
              </Text>
            </Pressable>
          </>
        )}

        {/* View old entry */}
        {viewingEntry && (
          <>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
            >
              {viewingEntry.date} Journal Entry{" "}
              {getMoodEmoji(viewingEntry.mood)}
            </Text>
            <Text
              style={{
                backgroundColor: "#f0f0f0",
                padding: 15,
                borderRadius: 10,
                textAlignVertical: "top",
                minHeight: 150,
              }}
            >
              {viewingEntry.text}
            </Text>

            <Pressable
              style={{
                backgroundColor: "#aaa",
                padding: 10,
                borderRadius: 8,
                marginTop: 20,
              }}
              onPress={() => setViewingEntry(null)}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                ← Back
              </Text>
            </Pressable>
          </>
        )}

        {/* New journal entry */}
        {showNewEntry && (
          <>
            <TextInput
              style={[styles.textarea, { marginTop: 20 }]}
              value={entry}
              onChangeText={setEntry}
              placeholder="Write your journal entry here..."
              multiline
            />

            <Pressable
              style={[styles.analyzeButton, { marginTop: 10 }]}
              onPress={handleSave}
            >
              <Text style={styles.analyzeButtonText}>Save Entry</Text>
            </Pressable>

            {loading && (
              <ActivityIndicator
                size="large"
                color="#4F46E5"
                style={{ marginVertical: 20 }}
              />
            )}

            <Pressable
              style={{
                backgroundColor: "#aaa",
                padding: 10,
                borderRadius: 8,
                marginTop: 20,
              }}
              onPress={() => setShowNewEntry(false)}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                ← Cancel
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </ScrollView>
  );
}
