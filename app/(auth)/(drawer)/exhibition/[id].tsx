import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

const exhibition = () => {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text>exhibition {id} </Text>
    </View>
  );
};
export default exhibition;
