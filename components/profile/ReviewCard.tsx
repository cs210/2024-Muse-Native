import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import colors from "@/styles/colors";
import { router } from "expo-router";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import { Ionicons } from "@expo/vector-icons";
import LikeButton from "../LikeReviewButton";

// Define the props for the component using TypeScript
interface ReviewCardProps {
  reviewId: string; // This prop will hold the review ID passed from the parent
  pfp: string;
  username: string;
  museumId: string;
  text: string;
  rating: number;
  museumName: string;
  exhibitionName: string;
  exhibitionId: string;
  coverPhoto: string;
  user_id: string;
  showImage: boolean;
}

const screenHeight = Dimensions.get("window").height;

const ReviewCard: React.FC<ReviewCardProps> = ({
  reviewId,
  pfp,
  username,
  text,
  rating,
  museumId,
  museumName,
  exhibitionName,
  exhibitionId,
  coverPhoto,
  user_id,
  showImage,
}) => {
  // ! Important Code:
  const handlePress = () => {
    // Navigate and pass the review ID to the destination screen
    router.push({
      pathname: "/(auth)/(drawer)/review/[id]",
      params: {
        id: JSON.stringify({
          reviewId,
          pfp,
          username,
          museumId,
          text,
          museumName,
          exhibitionName,
          exhibitionId,
          coverPhoto,
          user_id,
        }),
      },
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <View style={{ borderColor: "white", width: "100%", gap: 8 }}>
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
                  style={styles.exhibitionText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {exhibitionName.toUpperCase()}
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
          <LikeButton initialLiked={false} />
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
  exhibitionText: {
    color: colors.plum_light,
    width: 220,
    // borderWidth: 2,
  },
  reviewTextContainer: {
    flex: 2,
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
    paddingTop: 10,
    alignItems: "center",
  },
});

export default ReviewCard;
