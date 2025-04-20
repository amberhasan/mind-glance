import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Signup Failed", "All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Signup Failed", "Passwords do not match.");
      return;
    }
    Alert.alert("Signup Successful", "You can now log in.");
    router.push("/");
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24, backgroundColor: "#f3f4f6" }}>
      <View style={{ backgroundColor: "white", borderRadius: 12, padding: 24, elevation: 5 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>Create an Account</Text>
        <Text style={{ textAlign: "center", color: "#6b7280", marginTop: 4, marginBottom: 24 }}>
          Sign up to start your wellness journey
        </Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={{ borderColor: "#ccc", borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 16 }}
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{ borderColor: "#ccc", borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 16 }}
        />

        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={{ borderColor: "#ccc", borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 16 }}
        />

        <Pressable onPress={handleSignup} style={{ backgroundColor: "#4CAF50", padding: 14, borderRadius: 8, alignItems: "center" }}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Sign Up</Text>
        </Pressable>

        <Text style={{ textAlign: "center", fontSize: 12, marginTop: 16 }}>
          Already have an account? <Text style={{ textDecorationLine: "underline" }} onPress={() => router.push("/")}>Log in</Text>
        </Text>
      </View>
    </ScrollView>
  );
}
