import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import { Stack, useLocalSearchParams, Link } from "expo-router";

import colors from "@/styles/colors";
// TODO: Background when scrolling
const review = () => {
  const { id } = useLocalSearchParams();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Info */}
      <View style={styles.museumInfo}>
        <Link href={"/(auth)/(drawer)/exhibition"}>
          <Image
            source={require("../../../../images/cantor.jpg")}
            style={{
              width: 100,
              height: 100,
              borderRadius: 10,
            }}
          />
        </Link>
        {/* Visit Info */}
        <View style={styles.museumInfoTextCont}>
          <Link href={"/(auth)/(drawer)/exhibition"}>
            <Text style={styles.exhibitionText}>Day Jobs</Text>
          </Link>
          <Link href={"/(auth)/(drawer)/museum"}>
            <Text style={styles.museumText}>Cantor Arts Center </Text>
          </Link>
        </View>
      </View>
      {/* HEADER */}

      <View style={styles.header}>
        <Link href={"/(auth)/(drawer)/(tabs)/profile"}>
          <Image
            source={require("../../../../images/cantor.jpg")}
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
            }}
          />
        </Link>
        <Link href={"/(auth)/(drawer)/(tabs)/profile"}>
          <Text style={styles.username}> jajacque </Text>
        </Link>
      </View>

      <Text style={styles.reviewText}>
        This exhibition changed my life. Lorem ipsum dolor sit amet, consectetur
        adipiscing elit. Sed dui quam, rutrum sit amet interdum ac, dapibus
        condimentum nisl.This exhibition changed my life. Lorem ipsum dolor sit
        amet, consectetur adipiscing elit. Sed dui quam, rutrum sit amet
        interdum ac, dapibus condimentum nisl. This exhibition changed my life.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dui quam,
        rutrum sit amet interdum ac, dapibus condimentum nisl. This exhibition
        changed my life. Lorem ipsum dolor sit amet, consectetur adipiscing
        elit.
      </Text>

      <View style={styles.visited}>
        <Text style={styles.subtext}> Visited March 4, 2024</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    padding: 12,
    paddingTop: 48,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    marginTop: 30,
    alignItems: "center",
  },
  username: {
    color: colors.text_pink,
    fontFamily: "Inter_400Regular",
    fontSize: 17,
    fontWeight: "bold",
  },
  subtext: {
    color: colors.text_pink,
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  museumInfo: {
    flexDirection: "row",
    // borderWidth: 2,
    gap: 16,
  },
  exhibitionText: {
    color: colors.plum_light,
    fontSize: 20,
    fontWeight: "bold",
  },
  museumText: {
    color: colors.plum_light,
    fontSize: 20,
  },
  visited: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    // borderWidth: 2,
  },
  visitedText: {
    color: colors.plum_light,
    fontSize: 14,
  },
  museumInfoTextCont: {
    display: "flex",
    justifyContent: "center",
  },
  reviewText: {
    fontSize: 16,
    color: colors.plum_light,
  },
});
export default review;
