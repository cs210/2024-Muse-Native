import MuseumPost from "@/components/MuseumPost";
import colors from "@/styles/colors";
import { View, ScrollView, StyleSheet } from "react-native";

const HomePage = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={{ height: 350 }}>
        <MuseumPost />
      </View>
      <View style={{ height: 350 }}>
        <MuseumPost />
      </View>
      <View style={{ height: 350 }}>
        <MuseumPost />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: colors.background,
  },
});
export default HomePage;
