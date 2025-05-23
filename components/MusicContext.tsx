import React, { createContext, useContext, useEffect, useState } from "react";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";

type MusicContextType = {
  isPlaying: boolean;
  toggle: () => void;
  currentTrack: string;
  isLoaded: boolean;
  playNewTrack: (trackId: string) => void;
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState("calm");
  const [isLoaded, setIsLoaded] = useState(false);

  const trackMap: { [key: string]: string } = {
    calm: "https://github.com/amberhasan/mind-glance/blob/main/assets/music/Ambient__BPM120.mp3?raw=true",
    retro: "https://github.com/amberhasan/mind-glance/blob/main/assets/music/Ambient__BPM98.mp3?raw=true",
    nature: "https://github.com/amberhasan/mind-glance/blob/main/assets/music/Ambient__BPM72.mp3?raw=true",
  };

  useEffect(() => {
    const loadTrack = async () => {
      const stored = await AsyncStorage.getItem("selectedTrack");
      const track = stored || "calm";
      setCurrentTrack(track);
      await playMusic(track);
    };
    loadTrack();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const playMusic = async (trackId: string) => {
    setIsLoaded(false);

    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }

    try {
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: trackMap[trackId] });
      setSound(newSound);
      setIsPlaying(true);
      await newSound.setIsLoopingAsync(true);
      await newSound.playAsync();
      setIsLoaded(true);
    } catch (error) {
      console.error("Failed to load and play music:", error);
    }
  };

  const playNewTrack = async (trackId: string) => {
    setCurrentTrack(trackId);
    await AsyncStorage.setItem("selectedTrack", trackId);
    await playMusic(trackId);
  };

  const toggle = async () => {
    if (!sound) {
      console.warn("Sound is not yet initialized.");
      return;
    }

    const status = await sound.getStatusAsync();
    if (!status.isLoaded) {
      console.error("Sound object exists but is not fully loaded.");
      return;
    }

    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  return (
    <MusicContext.Provider
      value={{ isPlaying, toggle, currentTrack, isLoaded, playNewTrack }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within MusicProvider");
  }
  return context;
};
