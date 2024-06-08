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
      <Stack.Screen
        name="(tabs)"
        options={{ title: "Home", headerShown: false }}
      />
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
            fontFamily: "Poppins_700Bold",
          },
        }}
      />
      <Stack.Screen
        name="exhibition/[id]"
        options={{
          title: "Exhibition",
          headerShown: false,
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
            fontFamily: "Poppins_700Bold",
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
            fontFamily: "Poppins_700Bold",
          },
        }}
      />
      <Stack.Screen
        name="user/[id]"
        options={{
          title: "Museum",
          // drawerLabel: "Review",
          headerShown: false,
          headerTintColor: colors.text_pink,
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitleStyle: {
            fontSize: 18,
            color: colors.text_pink,
            fontFamily: "Poppins_700Bold",
          },
        }}
      />
      <Stack.Screen
        name="user/following"
        options={{
          title: "Museum",
          // drawerLabel: "Review",
          headerShown: false,
          headerTintColor: colors.text_pink,
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitleStyle: {
            fontSize: 18,
            color: colors.text_pink,
            fontFamily: "Poppins_700Bold",
          },
        }}
      />
      <Stack.Screen
        name="user/followers"
        options={{
          title: "Museum",
          // drawerLabel: "Review",
          headerShown: false,
          headerTintColor: colors.text_pink,
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitleStyle: {
            fontSize: 18,
            color: colors.text_pink,
            fontFamily: "Poppins_700Bold",
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
            fontFamily: "Poppins_700Bold",
          },
        }}
      />
      <Stack.Screen
        name="artifacts/ArtifactsList"
        options={{
          title: "Artifacts",
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
            fontFamily: "Poppins_700Bold",
          },
        }}
      />
      <Stack.Screen
        name="artifacts/[id]"
        options={{
          title: "Artifact",
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
            fontFamily: "Poppins_700Bold",
          },
        }}
      />
      <Stack.Screen
        name="artifact-review/[id]"
        options={{
          title: "Artifact Review",
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
            fontFamily: "Poppins_700Bold",
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
