import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
const followers = () => {
  const { following } = useLocalSearchParams();
  return (
    <View>
      <Text>{following}</Text>
    </View>
  );
};
export default followers;
