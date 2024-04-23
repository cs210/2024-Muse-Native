import colors from "@/styles/colors";
import { Drawer } from "expo-router/drawer";

const Layout = () => {
  return (
    <Drawer
      screenOptions={{
        drawerActiveBackgroundColor: colors.plum,
        drawerActiveTintColor: colors.text_pink,
        drawerInactiveTintColor: colors.text_pink,
        drawerStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Drawer.Screen name="(tabs)" options={{ headerShown: false }} />
      <Drawer.Screen
        name="settings"
        options={{
          title: "Settings",
          drawerLabel: "Settings",
          headerTintColor: colors.text_pink,
          headerStyle: {
            backgroundColor: colors.background,
          },
        }}
      />
    </Drawer>
  );
};
export default Layout;
