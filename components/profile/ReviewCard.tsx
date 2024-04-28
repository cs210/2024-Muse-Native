import { View, Text, StyleSheet, Image } from "react-native";
import colors from "@/styles/colors";
const ReviewCard = () => {
  return (
    <View style={styles.container}>
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
          <Text style={styles.museumText}> Cantor Arts Center </Text>
          <Text> Day Jobs </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: undefined,
    aspectRatio: 3,
    borderRadius: 10,
    backgroundColor: colors.plum,
    gap: 10,
  },
  header: {
    flexDirection: "row",
  },
  museumText: {
    color: "white",
  },
});
export default ReviewCard;
