import { View, Text } from "react-native";
import CustomButton from "../components/CustomButton";
import { styles } from "../constants/styles";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mind Glance 🧠</Text>

      <CustomButton title="Games" href="/games" />
      <CustomButton title="To Do" href="/todo" />
      <CustomButton title="Emotion Scan" href="/emotion-scan" />
      <CustomButton title="Journal" href="/journal" />
      <CustomButton title="Store" href="/store" />
      <CustomButton title="Options" href="/options" />
    </View>
  );
}
