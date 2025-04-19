import { View, Text, ScrollView } from "react-native";
import CustomButton from "../components/CustomButton";

export default function HomeScreen() {
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
        backgroundColor: "#f3f4f6",
      }}
    >
      <Text style={{ fontSize: 32, fontWeight: "bold", marginBottom: 10 }}>
        Mind Glance 🧠
      </Text>
      <Text style={{ fontSize: 16, color: "#555", marginBottom: 30 }}>
        Your mental wellness companion
      </Text>

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
        <CustomButton
          title="Emotion Scan"
          href="/emotion-scan"
          icon="heart-pulse"
        />
        <CustomButton title="Journal" href="/journal" icon="book-open" />
        <CustomButton title="Store" href="/store" icon="shopping" />
        <CustomButton title="Options" href="/options" icon="cog" />
      </View>
    </ScrollView>
  );
}
