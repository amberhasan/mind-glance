// app/_layout.tsx
import { Stack } from "expo-router";
import { MusicProvider } from "../components/MusicContext"; // adjust path if needed

export default function Layout() {
  return (
    <MusicProvider>
      <Stack />
    </MusicProvider>
  );
}
