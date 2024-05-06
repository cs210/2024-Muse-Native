import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { museumStyles } from "@/styles/museumStyles";
import colors from "@/styles/colors";
import { Link, router } from "expo-router";

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
}

const MuseumPost: React.FC<MuseumPostProps> = ({
  id,
  title,
  coverPhotoUrl,
  museumUsername,
  museumId,
  museumPfp,
}) => {
  const handleExhibitionPress = () => {
    router.push({
      pathname: "/(auth)/(drawer)/exhibition/[id]",
      params: { id: id },
    });
  };

  const handleMuseumPress = () => {
    router.push({
      pathname: "/(auth)/(drawer)/museum/[id]",
      params: { id: { id } },
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
        <Image
          source={{ uri: coverPhotoUrl }}
          style={styles.exhibitionImage}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <Text style={styles.exhibitionText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    flex: 1,
    backgroundColor: colors.background,
    flexDirection: "column", // Aligns children in a column
  },
  museumContainer: {
    backgroundColor: colors.background,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 27,
    marginLeft: 3,
    width: "auto",
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
  },
  exhibitionText: {
    width: "100%",
    height: "20%",
    color: colors.text_pink,
    fontFamily: "Inter_400Regular",
    fontSize: 20,
    paddingLeft: 5,
  },
  linkStyle: {
    flex: 1,
    width: "100%",
  },
});

export default MuseumPost;
