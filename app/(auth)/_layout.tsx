import { supabase } from "@/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { TouchableOpacity } from "react-native";

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: "#392132",
        },
        headerTintColor: "#ffeffa",
        tabBarActiveTintColor: "#ffeffa",
        tabBarStyle: {
          backgroundColor: "#392132",
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
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};
export default Layout;
