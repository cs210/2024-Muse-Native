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
import { supabase } from "@/utils/supabase";
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

  const handleProfileClicked = useCallback(async () => {
    if (review.user_id) {
      const { data: user, error: authError } = await supabase.auth.getUser();
      if (review.user_id === user.user?.id) {
        console.log("IM IN PROFILE");
        router.push({
          pathname: "/(auth)/(drawer)/(tabs)/profile",
          params: { id: review.user_id },
        });
      } else {
        router.push({
          pathname: "/(auth)/(drawer)/user/[id]",
          params: { id: review.user_id },
        });
      }
    }
  }, [review]); // Dependency array includes `review`

  const handleExhibitionPress = useCallback(() => {
    if (review?.reviewId) {
      router.push({
        pathname: "/(auth)/(drawer)/exhibition/[id]",
        params: { id: review.exhibitionId },
      });
    }
  }, [review]); // Dependency array includes `review`

  return (
    <View style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Info */}
        <View style={styles.museumInfo}>
          <TouchableOpacity
            style={{ alignSelf: "flex-start" }}
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
          <View style={[styles.museumInfoTextCont, { width: "65%" }]}>
            <TouchableOpacity
              style={{ alignSelf: "flex-start" }}
              onPress={handleExhibitionPress}
            >
              <Text
                style={styles.exhibitionText}
                numberOfLines={3}
                ellipsizeMode="tail"
              >
                {review?.exhibitionName}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignSelf: "flex-start" }}
              onPress={museumPressed}
            >
              <Text
                style={styles.museumText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {review.museumName}{" "}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* HEADER */}

        <View style={styles.reviewContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleProfileClicked}
              style={{
                alignSelf: "flex-start",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 5,
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
          <View style={styles.visited}></View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    gap: 8,
    padding: 12,
    paddingTop: 48,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
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
    marginBottom: 30,
  },
  exhibitionText: {
    color: colors.plum_light,
    fontSize: 20,
    fontWeight: "bold",
  },
  museumText: {
    color: colors.plum,
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
    marginTop: 10,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: colors.text_pink,
  },
  reviewContainer: {
    paddingHorizontal: 10,
  },
});
export default review;
