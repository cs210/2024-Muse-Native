import { NotoSerif_400Regular } from "@expo-google-fonts/noto-serif";
import { Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync(); // TODO: Custom Splash Screen

const InitialLayout = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("supabase.auth.onAuthStateChange", event, session);
      setSession(session);
      setInitialized(true);
    });

    return () => {
      data.subscription.unsubscribe(); // Prevent memory leak
    };
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === "(auth)";

    // Redirect to home page after signing in
    if (session && !inAuthGroup) {
      // IF USERNAME == NULL GOTO SETUP
      // ELSE:
      router.replace("/(auth)/(drawer)/setup");
    } else if (!session) {
      // Give time for custom fonts to load
      setTimeout(() => {
        router.replace("/");
      }, 1000);
    }
  }, [initialized, session]);

  let [loaded, error] = useFonts({
    NotoSerif_400Regular,
    Inter_400Regular,
    Inter_700Bold,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      // Give time for custom fonts to load
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 1000);
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}></Stack>
    </>
  );
};

export default function RootLayout() {
  return <InitialLayout />;
}
