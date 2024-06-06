import { Stack } from "expo-router";
import colors from "@/styles/colors";

const StackLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Home Screen",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="following"
        options={{
          title: "Following",
          headerShown: true,
          headerTintColor: colors.text_pink,
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitleStyle: {
            fontSize: 18,
            color: colors.text_pink,
            fontFamily: "Inter_400Regular",
          },
        }}
      />

      <Stack.Screen
        name="followers"
        options={{
          title: "Followers",
          headerShown: true,
          headerTintColor: colors.text_pink,
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitleStyle: {
            fontSize: 18,
            color: colors.text_pink,
            fontFamily: "Inter_400Regular",
          },
        }}
      />

      <Stack.Screen
        name="settings"
        options={{
          headerTitle: "User Settings",
        }}
      />
    </Stack>
  );
};

export default StackLayout;
