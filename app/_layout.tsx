import { NotoSerif_400Regular } from "@expo-google-fonts/noto-serif";
import { Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";
import "react-native-reanimated";
import "react-native-gesture-handler";

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

    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.log("Failed to Fetch User");
      } else {
        // Optionally set user details to state here
      }
    };

    const checkUserNameNull = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username")
        .eq("id", user?.id) // Filter for the specific ID
        .is("username", null); // Check if username is NULL

      if (error) {
        console.error("Error fetching data:", error);
        return false; // or handle the error in a way that fits your app logic
      }

        // If data is not empty, it means there's a row with id where username is NULL
        if (data.length > 0) {
          router.replace("/(auth)/(drawer)/setup");
        } else {
          // router.replace("/(auth)/(drawer)/(tabs)/home");
          //TODO: CHANGE BACK
          router.replace("/(auth)/(drawer)/(tabs)/home");
        }
      };

    if (session && !inAuthGroup) {
      console.log("inAuth");
      fetchUser();
      checkUserNameNull();
    } else if (!session) {
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
