import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import colors from "@/styles/colors";
import { router } from "expo-router";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import LikeButton from "../LikeReviewButton";
import { supabase } from "@/utils/supabase";

// Define the props for the component using TypeScript
interface ArtifactReviewCardProps {
  reviewId: string; // This prop will hold the review ID passed from the parent
  pfp: string;
  username: string;
  text: string;
  rating: number;
  artifactName: string;
  coverPhoto: string;
  userId: string;
  showImage: boolean;
}

const ArtifactReviewCard: React.FC<ArtifactReviewCardProps> = ({
  reviewId,
  pfp,
  username,
  text,
  rating,
  artifactName,
  coverPhoto,
  userId,
  showImage,
}) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);

  const handlePress = () => {
    // Navigate and pass the review ID to the destination screen
    router.push({
      pathname: "/(auth)/(drawer)/artifact-review/[id]",
      params: {
        reviewId: reviewId,
      },
    });
  };

  useEffect(() => {
    const checkUserLiked = async () => {
      const { count } = await supabase
        .from("user_likes_artifact_reviews")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("review_id", reviewId);

      if (count != null) {
        setIsLiked(count > 0);
      }
    };

    const checkLikeCount = async () => {
      const { count } = await supabase
        .from("user_likes_artifact_reviews")
        .select("*", { count: "exact", head: true })
        .eq("review_id", reviewId);

      if (count != null) {
        setLikeCount(count);
      }
    };

    if (userId && reviewId) {
      checkLikeCount();
      checkUserLiked();
    }
  }, [userId]);

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <View style={{ borderColor: "white", flex: 1, gap: 8 }}>
        <View style={styles.headerContainer}>
          <View style={styles.profileRatingContainer}>
            <View style={styles.profileContainer}>
              <Image
                source={{ uri: pfp }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 25,
                }}
              />
              <View
                style={{
                  // borderWidth: 2,
                  borderColor: "white",
                  width: "100%",
                  flex: 1,
                  gap: 2,
                }}
              >
                <Text style={styles.usernameText}>{username}</Text>
                <Text
                  style={styles.artifactName}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {artifactName.toUpperCase()}
                </Text>
              </View>
            </View>
            {rating ? (
              <View style={styles.starsContainer}>
                <StarRatingDisplay
                  rating={rating}
                  color={colors.text_darker_pink}
                  starSize={20}
                  starStyle={styles.starStyle}
                />
              </View>
            ) : null}
          </View>
          <View style={styles.exhibitionImageContainer}>
            {showImage && (
              <Image
                source={{ uri: coverPhoto }}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 5,
                }}
              />
            )}
          </View>
        </View>
        <View style={styles.reviewExhibitionContainer}>
          <View style={styles.reviewTextContainer}>
            <Text
              style={styles.reviewText}
              numberOfLines={7}
              ellipsizeMode="tail"
            >
              {text}
            </Text>
          </View>
        </View>
        <View style={styles.interactContainer}>
          <LikeButton
            initialLiked={isLiked}
            likeCount={likeCount}
            reviewId={reviewId}
            userId={userId}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingBottom: 15,
    borderRadius: 10,
    backgroundColor: colors.review_purple,
    gap: 10,
  },
  headerContainer: {
    // borderWidth: 1,
    flexDirection: "row",
  },
  profileRatingContainer: {
    flex: 1,
    // borderWidth: 1,
    gap: 5,
  },
  profileContainer: {
    flexDirection: "row",
    // borderWidth: 2,
    width: "auto",
    gap: 8,
    alignItems: "center",
  },
  usernameText: {
    color: colors.text_pink,
    fontFamily: "Inter_700Bold",
    textTransform: "lowercase",
  },
  artifactName: {
    color: colors.plum_light,
    width: 220,
    // borderWidth: 2,
  },
  reviewTextContainer: {
    paddingLeft: 5,
    paddingRight: 10,
    // borderWidth: 1,
    borderColor: colors.white,
    // alignItems: "center",
  },
  reviewText: {
    color: colors.text_pink,
    fontFamily: "Inter_400Regular",
    fontSize: 16,
  },
  exhibitionImageContainer: {
    marginRight: 0,
    marginLeft: "auto",
  },
  reviewExhibitionContainer: {
    flexDirection: "row",
  },
  starsContainer: {
    paddingTop: 5,
    paddingLeft: 2,
  },
  starStyle: {
    marginHorizontal: 1,
  },
  interactContainer: {
    marginTop: 10,
    flexDirection: "row",
    // borderWidth: 1,
  },
});

export default ArtifactReviewCard;
