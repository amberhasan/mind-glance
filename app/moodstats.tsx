import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

type MoodEntry = {
  mood: "great" | "okay" | "bad";
  date: string;
};

type MoodDay = {
  day: string;
  moodScore: number;
};

export default function MoodStatsScreen() {
  const [moodData, setMoodData] = useState<MoodDay[]>([]);

  useEffect(() => {
    const loadMoodData = async () => {
      const raw = await AsyncStorage.getItem("moodLog");
      let log: MoodEntry[] = [];

      try {
        const parsed = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(parsed)) throw new Error("Data is not an array");
        log = parsed;
      } catch (err) {
        console.error("Failed to parse mood log:", err);
        return;
      }

      const last7 = log.filter((entry) => {
        if (!entry?.date) return false;
        const diff = (Date.now() - new Date(entry.date).getTime()) / (1000 * 60 * 60 * 24);
        return diff < 7;
      });

      const grouped: MoodDay[] = Array(7).fill(null).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const formatted = date.toISOString().split("T")[0];

        const moods = last7
          .filter((entry) => entry.date.startsWith(formatted))
          .map((entry) => entry.mood);

        const moodScore = moods.reduce((acc, mood) => {
          if (mood === "great") return acc + 2;
          if (mood === "okay") return acc + 1;
          return acc;
        }, 0);

        return { day: formatted, moodScore };
      });

      setMoodData(grouped);
    };

    loadMoodData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🧠 Mood Statistics</Text>

      {moodData.length > 0 ? (
        <LineChart
          data={{
            labels: moodData.map((d) => d.day.slice(5)), // format: MM-DD
            datasets: [{ data: moodData.map((d) => d.moodScore) }],
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#f3f4f6",
            backgroundGradientTo: "#e0e7ff",
            color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
            labelColor: () => "#333",
            decimalPlaces: 0,
          }}
          style={{ borderRadius: 12, marginTop: 20 }}
        />
      ) : (
        <Text style={styles.empty}>No mood data yet.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  empty: {
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
});
