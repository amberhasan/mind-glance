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

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email === "Test@example.com" && password === "1234") {
      router.push("/home");
    } else {
      Alert.alert("Login Failed", "Invalid email or password.");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: "#f3f4f6",
      }}
    >
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 12,
          padding: 24,
          elevation: 5,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>
          Welcome back
        </Text>
        <Text
          style={{
            textAlign: "center",
            color: "#6b7280",
            marginTop: 4,
            marginBottom: 24,
          }}
        >
          Login to your Mind Glance account
        </Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={{
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
          }}
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
          }}
        />

        <Pressable
          onPress={handleLogin}
          style={{
            backgroundColor: "#4CAF50",
            padding: 14,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Login</Text>
        </Pressable>

        <Text style={{ textAlign: "center", fontSize: 12, marginTop: 16 }}>
          Don’t have an account?{" "}
          <Text
            style={{ textDecorationLine: "underline" }}
            onPress={() => router.push("/signup")}
          >
            Sign up
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}
