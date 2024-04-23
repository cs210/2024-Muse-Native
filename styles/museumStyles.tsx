import { StyleSheet } from "react-native";
import colors from "./colors";

export const museumStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    flexDirection: "column", // Aligns children in a row
  },
});