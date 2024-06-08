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
        tabBarActiveTintColor: colors.text_pink,

        tabBarLabelStyle: {
          fontSize: 18,
          textTransform: "none",
          fontFamily: "Poppins_700Bold",
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
        options={{ tabBarLabel: "Exhibitions" }}
      />
      <Tab.Screen
        name="users"
        component={UsersScreen}
        options={{ tabBarLabel: "Reviews" }}
      />
    </Tab.Navigator>
  );
};

export default HomePage;
