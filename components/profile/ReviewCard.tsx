import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import colors from "@/styles/colors";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

// Define the props for the component using TypeScript
interface ReviewCardProps {
  reviewId: number; // This prop will hold the review ID passed from the parent
}

const ReviewCard: React.FC<ReviewCardProps> = ({ reviewId }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    // Navigate and pass the review ID to the destination screen
    console.log(reviewId);
    router.push({
      pathname: "/(auth)/(drawer)/review/[id]",
      params: { id: reviewId },
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../images/cantor.jpg")}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
          }}
        />
        <View>
          <Text style={styles.museumText}>Cantor Arts Center</Text>
          <Text>Day Jobs</Text>
        </View>
      </View>
      <Text>Amazing. Inspiring. Admirable. Life-Changing.</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    aspectRatio: 2.5,
    padding: 12,
    borderRadius: 10,
    backgroundColor: colors.plum,
    gap: 10,
  },
  header: {
    flexDirection: "row",
    borderWidth: 2,
    gap: 8,
    alignItems: "center",
  },
  museumText: {
    color: "white",
  },
});

export default ReviewCard;
