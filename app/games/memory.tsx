import { View, Text, StyleSheet } from "react-native";

export default function MemoryMatch() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧠 Memory Match</Text>
      <Text style={styles.subtitle}>Coming Soon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: "gray",
  },
});
