// components/MusicContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { Audio } from "expo-av";
import { Alert } from "react-native";

const MusicContext = createContext<any>(null);

export const MusicProvider = ({ children }: { children: React.ReactNode }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const musicUri = "https://github.com/amberhasan/mind-glance/blob/main/assets/music/Ambient__BPM60.mp3?raw=true"; // Change if needed

  const loadSound = async () => {
    try {
      const { sound: loadedSound } = await Audio.Sound.createAsync(
        { uri: musicUri },
        { shouldPlay: true, isLooping: true }
      );
      setSound(loadedSound);
      setIsPlaying(true);
    } catch (error) {
      Alert.alert("Error", "Failed to load sound");
    }
  };

  const toggle = async () => {
    if (!sound) {
      await loadSound();
    } else {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    }
  };

  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  return (
    <MusicContext.Provider value={{ isPlaying, toggle }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error("useMusic must be used within MusicProvider");
  return context;
};
