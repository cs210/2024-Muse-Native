import colors from "@/styles/colors";
import { supabase } from "@/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { TouchableOpacity } from "react-native";
import { DrawerToggleButton } from "@react-navigation/drawer";

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: colors.background,
          height: 100,
        },
        headerTintColor: "#ffeffa",
        tabBarActiveTintColor: "#ffeffa",
        headerTitleStyle: {
          fontSize: 27,
          color: "#ffeffa",
          textAlign: "center",
          fontFamily: "NotoSerif_400Regular",
          marginTop: -5,
        },
        tabBarStyle: {
          backgroundColor: "#392132",
          borderTopWidth: 0,
          height: 90,
        },
        headerRight: () => (
          <TouchableOpacity onPress={() => supabase.auth.signOut()}>
            <Ionicons
              name="log-out-outline"
              size={24}
              color="#ffeffa"
              style={{ marginRight: 16 }}
            />
          </TouchableOpacity>
        ),
        headerLeft: () => <DrawerToggleButton tintColor={colors.text_pink} />,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Muse",
          tabBarShowLabel: false,
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Muse",
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Muse",
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen name="../settings" options={{ title: "Muse", href: null }} /> */}
    </Tabs>
  );
};
export default Layout;
