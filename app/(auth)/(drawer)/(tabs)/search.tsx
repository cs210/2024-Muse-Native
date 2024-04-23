import colors from "@/styles/colors";
import { ScrollView, StyleSheet, Text } from "react-native";

const SearchPage = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.text}>Search</Text>
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
export default SearchPage;
