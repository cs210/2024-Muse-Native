import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import colors from "@/styles/colors";
import ReviewCard from "@/components/profile/ReviewCard";
import { SafeAreaView } from "react-native-safe-area-context";
import FollowMuseumButton from "@/components/FollowMuseumButton";
// Get the full height of the screen
const screenHeight = Dimensions.get("window").height;

const exhibition = () => {
  const { id } = useLocalSearchParams();

  const museumPressed = () => {
    router.push({
      pathname: "/(auth)/(drawer)/museum/[id]",
      params: { id: 123 },
    });
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Container */}
      <View style={styles.container2}>
        <View style={styles.imageContainer}>
          <Image
            source={require("../../../../images/cantor.jpg")}
            style={styles.coverImage}
          />
          <View style={styles.gradientOverlay} />
        </View>
        <View style={styles.infoContainer}>
          <TouchableOpacity
            style={styles.logoContainer}
            onPress={museumPressed}
          >
            <Image
              source={require("../../../../images/cantor.jpg")}
              style={styles.museumLogo}
            />
          </TouchableOpacity>
          <Text style={{ color: "white", fontSize: 20 }}> cantorarts </Text>
          <FollowMuseumButton userId="123" museumId="123" />
        </View>
      </View>
      {/* TEXT */}
      <View style={{ padding: 12, gap: 12 }}>
        <Text style={{ color: "white" }}>Day Jobs </Text>
        <Text style={{ color: "white" }}>March 24th - July 3rd </Text>
        <Text style={{ color: "white" }}>
          Through some 160 works of painting, sculpture, photography, film, and
          ephemera, it will explore the comprehensive and far-reaching ways in
          which Black artists portrayed everyday modern life in the new Black
          cities that took shape in the 1920s–40s in New York City’s Harlem and
          nationwide in the early decades of the Great Migration when millions
          of African Americans began to move away from the segregated rural
          South.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    backgroundColor: colors.background,
    gap: 10,
  },
  profileContainer: {
    borderColor: "white",
    borderWidth: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  followersContainer: {
    borderColor: "white",
    borderWidth: 2,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: 10,
  },
  favoritesContainer: {
    borderColor: "white",
    borderWidth: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 10,
  },
  follow: {
    padding: 4,
    display: "flex",
    justifyContent: "center",
    gap: 4,
    alignItems: "center",
    borderColor: "white",
    borderWidth: 2,
  },
  text: {
    color: colors.text_pink,
    fontFamily: "Inter_400Regular",
    fontSize: 20,
  },
  signUpButton: {
    alignItems: "center",
    padding: 5,
    borderRadius: 4,
  },
  userNameText: {
    color: colors.text_pink,
    fontFamily: "Inter_700Bold",
    fontSize: 17,
  },
  favoriteScroll: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderColor: "white",
    borderWidth: 2,
  },
  reviewsContainer: {
    gap: 12,
    padding: 12,
  },
  container2: {
    position: "relative",
  },
  imageContainer: {
    width: "100%",
    height: screenHeight * 0.3,
    overflow: "hidden",
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
    top: 0,
    left: 0,
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    zIndex: 2,
    // React Native doesn't directly support CSS gradients,
    // you might need to use an image or external library to simulate gradients
  },
  infoContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderWidth: 2,
    backgroundColor: "blue",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    height: 75,
    width: 75,
    overflow: "hidden",
    borderRadius: 75,
    borderWidth: 2,
  },
  museumLogo: {
    height: "100%",
    resizeMode: "cover",
  },
});

export default exhibition;
