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
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import review from "../review/[id]";
import { QueryData } from "@supabase/supabase-js";
import { StarRatingDisplay } from "react-native-star-rating-widget";

type User = {
  id: string;
  username: string;
  avatar_url: string;
};

type Exhibition = {
  id: string;
  title: string;
};

type Artifact = {
  id: string;
  title: string;
  artist: string;
  year: string;
  cover_photo_url: string;
  exhibition: Exhibition;
};

type ArtifactReview = {
  id: string;
  text: string;
  rating: number;
  user: User;
  artifact: Artifact;
};

const artifact_review = () => {
  const { reviewId } = useLocalSearchParams();
  const [userId, setUserId] = useState("");
  const [review, setReview] = useState<ArtifactReview>();

  useEffect(() => {
    const getUserId = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const userId = session.user.id;
        setUserId(userId);
      }
    };

    if (reviewId) {
      getUserId();
    }
  }, [reviewId]);

  useEffect(() => {
    const getArtifactReviewData = async () => {
      const artifactReviewQuery = supabase
        .from("artifact_reviews")
        .select(
          `
          id,
          text,
          rating,
          user: user_id ( id, username, avatar_url ),
          artifact: artifact_id ( id, title, artist, year, cover_photo_url, exhibition: exhibition_id ( id, title ) )
          `
        )
        .eq("id", reviewId)
        .returns<ArtifactReview>()
        .single();
      const { data, error } = await artifactReviewQuery;
      console.log(data);
      if (error) throw error;
      setReview(data);
    };
    if (reviewId) {
      getArtifactReviewData();
    }
  }, [reviewId]);

  const handleProfileClicked = useCallback(async () => {
    if (review?.user.id) {
      const { data: user, error: authError } = await supabase.auth.getUser();
      if (review.user.id === user.user?.id) {
        console.log("IM IN PROFILE");
        router.push({
          pathname: "/(auth)/(drawer)/(tabs)/profile",
          params: { id: review.user.id },
        });
      } else {
        router.push({
          pathname: "/(auth)/(drawer)/user/[id]",
          params: { id: review.user.id },
        });
      }
    }
  }, [reviewId]);

  const handleArtifactPress = useCallback(() => {
    if (review?.id) {
      router.push({
        pathname: "/(auth)/(drawer)/artifacts/[id]",
        params: { id: review.artifact.id },
      });
    }
  }, [review]);

  const handleExhibitionPress = useCallback(() => {
    if (review?.id) {
      router.push({
        pathname: "/(auth)/(drawer)/exhibition/[id]",
        params: { id: review.artifact.exhibition.id },
      });
    }
  }, [review]);

  return (
    <View style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Info */}
        <View style={styles.museumInfo}>
          <TouchableOpacity
            style={{ alignSelf: "flex-start" }}
            onPress={handleArtifactPress}
          >
            <Image
              source={{ uri: review?.artifact.cover_photo_url }}
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
              onPress={handleArtifactPress}
            >
              <Text
                style={styles.exhibitionText}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {review?.artifact.title}
              </Text>
            </TouchableOpacity>
            <Text style={styles.artist}>{review?.artifact.artist}</Text>
            <TouchableOpacity
              style={{ alignSelf: "flex-start" }}
              onPress={handleExhibitionPress}
            >
              <Text
                style={styles.museumText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {review?.artifact.exhibition.title}
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
                source={{ uri: review?.user.avatar_url }}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                }}
              />

              <Text style={styles.username}>
                {review?.user.username}
              </Text>
            </TouchableOpacity>
            {review?.rating && (
              <StarRatingDisplay
                rating={review.rating}
                color={colors.text_darker_pink}
                starSize={20}
                starStyle={styles.starStyle}
              />
            )}
          </View>
          <Text style={styles.reviewText}>{review?.text}</Text>
          <View style={styles.visited}></View>
        </View>
        {/* <TouchableOpacity onPress={handleToggleLike} style={{ borderWidth: 2 }}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={32}
            color={colors.plum}
          />
        </TouchableOpacity> */}
        {/* <Text style={{ color: colors.text_pink }}> {likeCount} </Text> */}
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
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    marginRight: 5,
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
    gap: 2,
  },
  reviewText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: colors.text_pink,
    lineHeight: 25,
  },
  reviewContainer: {
    paddingHorizontal: 10,
  },
  starStyle: {
    marginHorizontal: 1,
  },
  artist: {
    alignSelf: "flex-start",
    fontFamily: "Inter_700Bold",
    color: colors.white,
    fontSize: 16,
  },
});
export default artifact_review;
