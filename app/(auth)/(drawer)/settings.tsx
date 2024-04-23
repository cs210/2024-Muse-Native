import colors from "@/styles/colors";
import { Stack } from "expo-router";
import { ScrollView, StyleSheet, Text } from "react-native";

const SettingsPage = () => {
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Settings",
        }}
      />
      <Text style={styles.text}>Settings</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: colors.background,
  },
  text: {
    color: colors.text_pink,
    fontFamily: "Inter_400Regular",
    fontSize: 20,
  },
});
export default SettingsPage;
