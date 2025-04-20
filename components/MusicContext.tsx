import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";

type MusicContextType = {
  isPlaying: boolean;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  toggle: () => Promise<void>;
};

const MusicContext = createContext<MusicContextType | null>(null);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const sound = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const loadSound = async () => {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
      });

      const { sound: loadedSound } = await Audio.Sound.createAsync(
        require("../assets/music/Ambient__BPM60.mp3"), // 👈 place music.mp3 in your assets folder
        { shouldPlay: true, isLooping: true, volume: 1.0 }
      );

      sound.current = loadedSound;
      setIsPlaying(true);
    };

    loadSound();

    return () => {
      sound.current?.unloadAsync();
    };
  }, []);

  const play = async () => {
    if (sound.current && !isPlaying) {
      await sound.current.playAsync();
      setIsPlaying(true);
    }
  };

  const pause = async () => {
    if (sound.current && isPlaying) {
      await sound.current.pauseAsync();
      setIsPlaying(false);
    }
  };

  const toggle = async () => {
    if (isPlaying) await pause();
    else await play();
  };

  return (
    <MusicContext.Provider value={{ isPlaying, play, pause, toggle }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error("useMusic must be used within MusicProvider");
  return context;
};
