import { Stack } from "expo-router";

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
          headerShown: true,
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
