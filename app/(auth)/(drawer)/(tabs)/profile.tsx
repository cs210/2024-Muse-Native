import colors from "@/styles/colors";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { supabase } from "@/utils/supabase";

// TODO: Unhardcode
const ProfilePage = () => {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.container}>
        {/* Profile Container */}
        <View style={styles.profileContainer}>
          <Image
            source={require("../../../../images/cantor.jpg")}
            style={{
              width: 100,
              height: 100,
              borderRadius: 100 / 2,
            }}
          />
          <Text style={styles.userNameText}>jajacque</Text>
        </View>
        {/*Followers / Following */}
        <View style={styles.profileContainer}>
          <Image
            source={require("../../../../images/cantor.jpg")}
            style={{
              width: 100,
              height: 100,
              borderRadius: 100 / 2,
            }}
          />
          <Text style={styles.userNameText}>jajacque</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    padding: 12,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: 12,
    paddingVertical: 40,
    backgroundColor: colors.background,
  },
  profileContainer: {
    borderColor: "white",
    borderWidth: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
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
});
export default ProfilePage;
