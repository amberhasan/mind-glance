import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { styles } from "../constants/styles";
import BackButton from "../components/BackButton"; // Assuming you have this

export default function JournalScreen() {
  const [entry, setEntry] = useState("");
  const [mood, setMood] = useState("");
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);

  const getMoodEmoji = (mood) => {
    if (mood === "POSITIVE") return "😊";
    if (mood === "NEGATIVE") return "😞";
    return "😐"; // neutral or unknown
  };

  async function handleAnalyze() {
    if (!entry.trim()) {
      Alert.alert("Entry is empty", "Please write something first.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: entry }),
      });

      const data = await response.json();
      setMood(data.mood);
      setConfidence(data.confidence);
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
      Alert.alert("Error", "Failed to analyze mood.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <BackButton />

        <Text style={styles.title}>Journal 📓</Text>

        <TextInput
          style={styles.textarea}
          value={entry}
          onChangeText={setEntry}
          placeholder="Write your journal entry here..."
          multiline
        />

        <Pressable style={styles.analyzeButton} onPress={handleAnalyze}>
          <Text style={styles.analyzeButtonText}>Analyze Mood</Text>
        </Pressable>

        {loading && (
          <ActivityIndicator
            size="large"
            color="#4F46E5"
            style={{ marginBottom: 20 }}
          />
        )}

        {mood && (
          <View style={styles.moodResult}>
            <Text style={styles.emoji}>{getMoodEmoji(mood)}</Text>
            <Text style={styles.moodText}>Mood: {mood}</Text>
            <Text style={styles.confidenceText}>
              Confidence: {(confidence * 100).toFixed(2)}%
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
