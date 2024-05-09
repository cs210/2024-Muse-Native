import colors from "@/styles/colors";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import UsersScreen from "./users";
import MuseumsScreen from "./museums";

const Tab = createMaterialTopTabNavigator();

const HomePage = () => {
  return (
    <Tab.Navigator
      initialRouteName="museums"
      screenOptions={{
        tabBarActiveTintColor: colors.text_darker_pink,

        tabBarLabelStyle: {
          fontSize: 18,
          textTransform: "none",
          fontFamily: "Inter_700Bold",
        },
        tabBarStyle: {
          backgroundColor: colors.background,
        },
        tabBarIndicatorStyle: { backgroundColor: colors.text_pink },
      }}
    >
      <Tab.Screen
        name="museums"
        component={MuseumsScreen}
        options={{ tabBarLabel: "Museums" }}
      />
      <Tab.Screen
        name="users"
        component={UsersScreen}
        options={{ tabBarLabel: "Users" }}
      />
    </Tab.Navigator>
  );
};

export default HomePage;
