import { Pressable, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function CustomButton({
  title,
  href,
}: {
  title: string;
  href: string;
}) {
  const router = useRouter();

  return (
    <Pressable style={styles.button} onPress={() => router.push(href)}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginTop: 12, // << smaller margin now for multiple buttons
    width: "80%", // << makes buttons aligned and same width
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
});
