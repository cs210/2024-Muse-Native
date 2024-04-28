import { View, Text, StyleSheet, Image } from "react-native";
import colors from "@/styles/colors";

const FavoriteCard = () => {
  return (
    <View>
      <Image
        source={require("../../images/cantor.jpg")}
        style={{
          width: 100,
          height: 100,
          borderRadius: 10,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    padding: 12,
    backgroundColor: colors.background,
  },
});
export default FavoriteCard;
