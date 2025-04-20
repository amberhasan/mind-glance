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
    if (email === "test@example.com" && password === "1234") {
      router.push("/home"); // Navigate to home after successful login
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
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 10,
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

        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 4, fontWeight: "600" }}>Email</Text>
          <TextInput
            placeholder="m@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={{
              borderColor: "#ccc",
              borderWidth: 1,
              borderRadius: 8,
              padding: 12,
              backgroundColor: "#fff",
            }}
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontWeight: "600" }}>Password</Text>
            <Text style={{ fontSize: 12, textDecorationLine: "underline" }}>
              Forgot your password?
            </Text>
          </View>
          <TextInput
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{
              borderColor: "#ccc",
              borderWidth: 1,
              borderRadius: 8,
              padding: 12,
              backgroundColor: "#fff",
              marginTop: 4,
            }}
          />
        </View>

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

        <Text
          style={{
            textAlign: "center",
            marginVertical: 16,
            color: "#6b7280",
          }}
        >
          Or continue with
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <Pressable
            style={{
              flex: 1,
              borderColor: "#ccc",
              borderWidth: 1,
              borderRadius: 8,
              padding: 12,
              alignItems: "center",
              backgroundColor: "#fff",
            }}
          >
            <Text></Text>
          </Pressable>
          <Pressable
            style={{
              flex: 1,
              borderColor: "#ccc",
              borderWidth: 1,
              borderRadius: 8,
              padding: 12,
              alignItems: "center",
              backgroundColor: "#fff",
            }}
          >
            <Text>G</Text>
          </Pressable>
          <Pressable
            style={{
              flex: 1,
              borderColor: "#ccc",
              borderWidth: 1,
              borderRadius: 8,
              padding: 12,
              alignItems: "center",
              backgroundColor: "#fff",
            }}
          >
            <Text>M</Text>
          </Pressable>
        </View>

        <Text style={{ textAlign: "center", fontSize: 12, marginTop: 16 }}>
          Don’t have an account?{" "}
          <Text style={{ textDecorationLine: "underline" }}>Sign up</Text>
        </Text>
      </View>

      <Text
        style={{
          marginTop: 20,
          textAlign: "center",
          fontSize: 12,
          color: "#6b7280",
        }}
      >
        By clicking continue, you agree to our{" "}
        <Text style={{ textDecorationLine: "underline" }}>
          Terms of Service
        </Text>{" "}
        and{" "}
        <Text style={{ textDecorationLine: "underline" }}>
          Privacy Policy
        </Text>
        .
      </Text>
    </ScrollView>
  );
}
