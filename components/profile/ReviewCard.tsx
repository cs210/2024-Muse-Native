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
import { Ionicons } from "@expo/vector-icons";

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
      <View style={styles.exhibitionTitleContainer}>
        <Text
          style={styles.exhibitionText}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {exhibitionName.toUpperCase()}
        </Text>
      </View>
      <View style={styles.container2}>
        <View style={styles.leftContainer}>
          <View style={styles.pfpContainer}>
            <Image
              source={{ uri: pfp }}
              style={{
                width: 35,
                height: 35,
                borderRadius: 25,
              }}
            />
          </View>
          <View style={styles.engageContainer}>
            <Ionicons name="heart-outline" size={25} color={colors.text_pink} />
            <Ionicons
              name="chatbubble-outline"
              size={25}
              color={colors.text_pink}
            />
            <Ionicons name="share-outline" size={25} color={colors.text_pink} />
          </View>
        </View>
        <View style={styles.container3}>
          <View style={styles.header}>
            <Text style={styles.usernameText}>{username}</Text>
          </View>
          <View style={styles.reviewTextContainer}>
            <Text
              style={styles.reviewText}
              numberOfLines={5}
              ellipsizeMode="tail"
            >
              {text}
            </Text>
          </View>
        </View>
        <View style={styles.exhibitionImageContainer}>
          {showImage && (
            <Image
              source={{ uri: coverPhoto }}
              style={{
                width: 115,
                height: "100%",
                borderBottomRightRadius: 10,
              }}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // borderWidth: 1,
    flex: 1,
    flexDirection: "column",
    width: "100%",
    height: 200,
    borderRadius: 10,
    backgroundColor: colors.review_purple,
  },
  container2: {
    // borderWidth: 1,
    flexDirection: "row",
    flex: 1,
    // paddingVertical: 10,
  },
  container3: {
    // borderWidth: 1,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    // borderWidth: 1,
    width: "auto",
    gap: 8,
    marginBottom: 3,
    paddingTop: 17,
  },
  usernameText: {
    color: colors.text_pink,
    fontFamily: "Inter_700Bold",
    textTransform: "lowercase",
  },
  exhibitionText: {
    color: colors.text_darker_pink,
    textAlign: "center",
  },
  reviewTextContainer: {
    flex: 1,
    paddingLeft: 5,
    paddingRight: 10,
    paddingTop: 10,
    // borderWidth: 1,
    borderColor: colors.white,
  },
  reviewText: {
    color: colors.text_pink,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 20,
    paddingTop: 2,
    textAlign: "center",
  },
  exhibitionImageContainer: {
    // borderWidth: 1,
    marginRight: 0,
    marginLeft: "auto",
  },
  reviewExhibitionContainer: {
    flexDirection: "row",
    // borderWidth: 1,
  },
  engageContainer: {
    // borderWidth: 1,
    width: "100%",
    paddingTop: 10,
    gap: 18,
    alignItems: "center",
  },
  leftContainer: {
    width: 47,
    flexDirection: "column",
    alignItems: "center",
    // paddingLeft: 10,
  },
  pfpContainer: {
    // borderWidth: 1,
    width: "100%",
    paddingTop: 10,
    alignItems: "center",
  },
  exhibitionTitleContainer: {
    // borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: colors.plum,
  },
});

export default ReviewCard;
