import colors from "@/styles/colors";
import { ScrollView, Text, StyleSheet } from "react-native";

const ProfilePage = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.text}>Profile</Text>
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
export default ProfilePage;
