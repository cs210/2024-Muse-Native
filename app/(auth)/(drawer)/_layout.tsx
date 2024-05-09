import colors from "@/styles/colors";
import { Drawer } from "expo-router/drawer";
import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack
    // screenOptions={{
    //   drawerActiveBackgroundColor: colors.plum,
    //   drawerActiveTintColor: colors.text_pink,
    //   drawerInactiveTintColor: colors.text_pink,
    //   drawerStyle: {
    //     backgroundColor: colors.background,
    //   },
    // }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="settings"
        options={{
          title: "Settings",
          // drawerLabel: "Settings",
          headerTintColor: colors.text_pink,
          headerStyle: {
            backgroundColor: colors.background,
          },
        }}
      />
      <Stack.Screen
        name="review/[id]"
        options={{
          title: "Review",
          // drawerLabel: "Review",
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
        name="exhibition/[id]"
        options={{
          title: "Exhibition",
          // drawerLabel: "Review",
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
        name="museum/[id]"
        options={{
          title: "Museum",
          // drawerLabel: "Review",
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
        name="write-review/WriteReview"
        options={{
          title: "Write a Review",
          // drawerLabel: "Review",
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
        name="setup"
        options={{
          title: "Settings",
          // drawerLabel: "Settings",
          headerShown: false,
        }}
      />
    </Stack>
  );
};
export default Layout;
