import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import colors from "@/styles/colors";

// Get the full height of the screen
const screenHeight = Dimensions.get("window").height;

const exhibition = () => {
  const { id } = useLocalSearchParams();
  return (
    <ScrollView contentContainerStyle={styles.containerScroll}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={require("../../../../images/cantor.jpg")}
            style={styles.coverImage}
          />
          <View style={styles.gradientOverlay} />
        </View>

        <View style={styles.logoContainer}>
          <Image
            source={require("../../../../images/cantor.jpg")}
            style={styles.museumLogo}
          />
        </View>
      </View>
      <Text style={{ color: "white" }}> {id} </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containerScroll: {
    backgroundColor: colors.background, // Just as an example for visibility
    flex: 1,
  },
  container: {
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
  logoContainer: {
    height: 75,
    width: 75,
    position: "absolute",
    bottom: 10,
    right: 10,
    overflow: "hidden",
    borderRadius: 10,
  },
  museumLogo: {
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
    zIndex: 10,
    top: "50%",
    left: "50%",
    transform: [{ translateX: -37.5 }, { translateY: -37.5 }], // Adjusting translate based on half of the width and height
  },
});

export default exhibition;
