import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { museumStyles } from "@/styles/museumStyles";
import colors from "@/styles/colors";

const windowWidth = Dimensions.get("window").width;
const iconSize = windowWidth * 0.08; // for example, 8% of the window width

const MuseumPost = () => {
  return (
    <View style={styles.container}>
      {/* Museum Name and PFP */}
      <View style={styles.museumContainer}>
        <Image source={require("../images/cantor.jpg")} style={styles.icon} />
        <Text style={styles.usernameText}>cantorarts</Text>
      </View>
      {/* Exhibition */}
      <View style={styles.exhibition}>
        <Image
          source={require("../images/exhibition.jpg")}
          style={styles.exhibitionImage}
          resizeMode="cover"
        />
        <Text style={styles.exhibitionText}>Day Jobs</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    flexDirection: "column", // Aligns children in a column
    marginBottom: 10,
  },
  museumContainer: {
    backgroundColor: colors.background,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 27,
    marginLeft: 3,
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
    height: "90%", // Ensures the image's height is the same as the container
    borderRadius: 20,
    marginBottom: 7,
  },
  exhibitionText: {
    width: "100%",
    height: "20%",
    color: colors.text_pink,
    fontFamily: "Inter_400Regular",
    fontSize: 20,
    paddingLeft: 5,
  }
});

export default MuseumPost;