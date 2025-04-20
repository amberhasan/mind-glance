import { MusicProvider } from "../components/MusicContext";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <MusicProvider>
      <Stack />
    </MusicProvider>
  );
}
