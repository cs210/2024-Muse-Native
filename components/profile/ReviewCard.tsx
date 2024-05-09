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

// interface Review {
//   id: string;
//   exhibition_id: string;
//   user_id: string; // assuming there is a user associated with the review
//   text: string;
//   created_at: Date;
//   //TODO:
//   // Exhibition name !
//   // Museum Name !
//   // User Photo
//   // museum id !
// }

// Define the props for the component using TypeScript
interface ReviewCardProps {
  reviewId: string; // This prop will hold the review ID passed from the parent
  pfp: string;
  username: string;
  museumId: string;
  text: string;
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
        <View style={styles.header}>
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
        <View style={styles.reviewExhibitionContainer}>
          <View style={styles.reviewTextContainer}>
            <Text
              style={styles.reviewText}
              numberOfLines={5}
              ellipsizeMode="tail"
            >
              {text}
            </Text>
          </View>
          <View style={styles.exhibitionImageContainer}>
            {showImage && (
              <Image
                source={{ uri: coverPhoto }}
                style={{
                  width: 95,
                  height: 95,
                  borderRadius: 5,
                }}
              />
            )}
          </View>
        </View>
      </View>
      <View
        style={{
          // borderWidth: 2,
          borderColor: "white",
          width: "auto",
          justifyContent: "center",
          alignItems: "center",
        }}
      ></View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    height: 175,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.review_purple,
    gap: 10,
  },
  header: {
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
    width: 250,
    // borderWidth: 2,
  },
  reviewTextContainer: {
    width: "100%",
    flex: 2,
    paddingLeft: 5,
    paddingRight: 10,
    // borderWidth: 1,
    borderColor: colors.white,
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
});

export default ReviewCard;
