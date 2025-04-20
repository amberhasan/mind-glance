import { MusicProvider } from "../components/MusicContext";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <MusicProvider>
      <Stack
        screenOptions={{
          headerTitle: "", // <-- No text
          headerTransparent: false, // (optional) keep background solid
        }}
      />
    </MusicProvider>
  );
}
