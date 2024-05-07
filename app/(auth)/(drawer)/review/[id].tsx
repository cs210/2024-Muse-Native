import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Stack, useLocalSearchParams, Link, router } from "expo-router";

import colors from "@/styles/colors";
import { useCallback } from "react";
// TODO: Background when scrolling
const review = () => {
  const { id } = useLocalSearchParams();
  const review = JSON.parse(id);

  const museumPressed = () => {
    router.push({
      pathname: "/(auth)/(drawer)/museum/[id]",
      params: { id: review.museumId },
    });
  };

  const handleProfileClicked = useCallback(() => {
    if (review.user_id) {
      console.log(review.user_id);
      router.push({
        pathname: "/(auth)/(drawer)/user/[id]",
        params: { id: review.user_id },
      });
    }
  }, [review]); // Dependency array includes `review`

  const handleExhibitionPress = useCallback(() => {
    console.log("review ID: " + review?.reviewId);
    if (review?.reviewId) {
      router.push({
        pathname: "/(auth)/(drawer)/exhibition/[id]",
        params: { id: review.exhibitionId },
      });
    }
  }, [review]); // Dependency array includes `review`

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Info */}
      <View style={styles.museumInfo}>
        <TouchableOpacity
          style={{ borderWidth: 2, alignSelf: "flex-start" }}
          onPress={handleExhibitionPress}
        >
          <Image
            source={{ uri: review.coverPhoto }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 10,
            }}
          />
        </TouchableOpacity>
        {/* Visit Info */}
        <View style={styles.museumInfoTextCont}>
          <TouchableOpacity
            style={{ alignSelf: "flex-start" }}
            onPress={handleExhibitionPress}
          >
            <Text style={styles.exhibitionText}>{review?.exhibitionName}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ borderWidth: 2, alignSelf: "flex-start" }}
            onPress={museumPressed}
          >
            <Text style={styles.museumText}>{review.museumName} </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleProfileClicked}
          style={{
            borderWidth: 2,
            alignSelf: "flex-start",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={{ uri: review.pfp }}
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
            }}
          />

          <Text style={styles.username}> {review.username} </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.reviewText}>{review.text}</Text>

      <View style={styles.visited}>
        {/* <Text style={styles.subtext}> Visited </Text> */}
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
