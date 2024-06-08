// CustomHeader.js
import React from "react";
import {
  Animated,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "@/styles/colors";
import Icon from "react-native-vector-icons/Ionicons";

const CustomHeader = ({ title, scrollY }) => {
  const navigation = useNavigation();

  const { height: screenHeight } = Dimensions.get("window");
  const HEADER_MAX_HEIGHT = screenHeight * 0.1; // 10% of screen height
  const HEADER_MIN_HEIGHT = screenHeight * 0.06; // 5% of screen height

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const arrowOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  return (
    <Animated.View style={[styles.header, { height: headerHeight }]}>
      <View style={styles.headerContent}>
        <Animated.View style={[styles.backButton, { opacity: arrowOpacity }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.text_pink} />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={{ opacity: arrowOpacity }}>
          <Text style={styles.headerTitle}>{title}</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40, // Adjust padding to account for the status bar if needed
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: colors.text_pink,
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    left: 10,
  },
});

export default CustomHeader;
