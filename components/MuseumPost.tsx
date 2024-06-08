import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import colors from "@/styles/colors";
import { router } from "expo-router";
import { useState } from "react";
import CircularProgress from "react-native-circular-progress-indicator";
import { PlaceholderContainer } from "react-native-loading-placeholder";
import React from "react";

const windowWidth = Dimensions.get("window").width;
const iconSize = windowWidth * 0.08; // for example, 8% of the window width

// TODO: MUSEUM PROFILE PHOTO, MUSEUM ID
interface MuseumPostProps {
  id: string;
  museumId: string;
  museumPfp: string;
  title: string;
  coverPhotoUrl: string;
  museumUsername: string;
  averageRating: number;
}

const MuseumPost: React.FC<MuseumPostProps> = ({
  id,
  title,
  coverPhotoUrl,
  museumUsername,
  museumId,
  averageRating,
  museumPfp,
}) => {
  const [loading, setLoading] = useState(true);
  const handleExhibitionPress = () => {
    router.push({
      pathname: "/(auth)/(drawer)/exhibition/[id]",
      params: { id: id },
    });
  };

  const handleMuseumPress = () => {
    router.push({
      pathname: "/(auth)/(drawer)/museum/[id]",
      params: { id: museumId },
    });
  };

  return (
    <View style={styles.container}>
      {/* Museum Name and PFP */}
      <TouchableOpacity
        style={styles.museumContainer}
        onPress={handleMuseumPress}
      >
        <Image source={{ uri: museumPfp }} style={styles.icon} />
        <Text style={styles.usernameText}>{museumUsername}</Text>
      </TouchableOpacity>
      {/* Exhibition */}
      <TouchableOpacity
        style={styles.exhibition}
        onPress={handleExhibitionPress}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: coverPhotoUrl }}
            style={styles.exhibitionImage}
            resizeMode="cover"
            onLoadStart={() => {
              setLoading(true);
            }}
            onLoadEnd={() => {
              setLoading(false);
            }}
          />
          {loading && (
            <ActivityIndicator
              style={styles.activityIndicator}
              size="large"
              color={colors.text_pink} // Ensure colors.text_pink is defined in your colors object
            />
          )}
          <View style={styles.circularProgress}>
            {averageRating !== 0 && (
              <CircularProgress
                value={averageRating}
                radius={30}
                maxValue={5}
                activeStrokeWidth={8}
                titleColor={"#FFF"}
                inActiveStrokeWidth={8}
                clockwise={false}
                duration={100}
                activeStrokeColor={colors.plum_light}
                progressValueColor={colors.white}
                progressFormatter={(value: number) => {
                  "worklet";
                  return value.toFixed(1); // 2 decimal places
                }}
                circleBackgroundColor={"rgba(0,0,0,0.4)"}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.exhibitionTextContainer}>
        <Text style={styles.exhibitionText}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // borderWidth: 2,
    flex: 1,
    backgroundColor: colors.background,
    flexDirection: "column", // Aligns children in a column
    marginBottom: 40,
  },
  museumContainer: {
    backgroundColor: colors.background,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 10,
    marginLeft: 3,
    width: "auto",
  },
  hidden: {
    width: 0,
    height: 0, // Effectively hides the image
  },
  icon: {
    width: iconSize, // Set a fixed width for your icon
    height: iconSize, // Set the height equal to the width to create a square (which will become a circle with borderRadius)
    borderRadius: 25, // Half of the width and height to create a perfect circle
    marginRight: 7, // Add some margin on the right of the icon
  },
  usernameText: {
    color: colors.text_pink, // Replace with the exact text color from your image
    fontFamily: "Inter_700Bold", // Makes the text bold
    fontSize: 15,
  },
  exhibition: {
    flex: 1, // Container takes the remaining space
    justifyContent: "center", // Center the image vertically
    flexDirection: "column",
  },
  exhibitionImage: {
    width: "100%", // Ensures the image's width is the same as the container
    height: "100%", // Ensures the image's height is the same as the container
    borderRadius: 20,
  },
  exhibitionTextContainer: {
    paddingLeft: 5,
    paddingTop: 10,
  },
  exhibitionText: {
    width: "100%",
    color: colors.text_pink,
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
  },
  linkStyle: {
    flex: 1,
    width: "100%",
  },
  imageContainer: {
    position: "relative",
    width: "100%", // Adjust width as necessary
    height: "100%", // Adjust height as necessary
  },
  circularProgress: {
    position: "absolute",
    bottom: 10, // Adjust as necessary for your design
    right: 10, // Adjust as necessary for your design
  },
  activityIndicator: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MuseumPost;
