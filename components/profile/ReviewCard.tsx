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
import { useNavigation } from "@react-navigation/native";
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
}) => {
  const navigation = useNavigation();

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
        }),
      },
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: pfp }}
          style={{
            width: 35,
            height: 35,
            borderRadius: 25,
          }}
        />
        <View>
          <Text style={styles.museumText}>{username}</Text>
        </View>
      </View>
      <Text style={styles.reviewText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: screenHeight / 6,
    padding: 12,
    borderRadius: 10,
    backgroundColor: colors.plum,
    gap: 10,
  },
  header: {
    flexDirection: "row",
    // borderWidth: 2,
    gap: 8,
    alignItems: "center",
  },
  museumText: {
    color: colors.white,
    fontFamily: "Inter_700Bold",
  },
  reviewText: {
    color: colors.white,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
  }
});

export default ReviewCard;
