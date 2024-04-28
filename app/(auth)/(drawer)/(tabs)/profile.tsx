import colors from "@/styles/colors";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  Image,
  SafeAreaView,
} from "react-native";
import FavoriteCard from "@/components/profile/FavoriteCard";
import ReviewCard from "@/components/profile/ReviewCard";
import { supabase } from "@/utils/supabase";

// TODO: Unhardcode
// TODO: Add Lists Feature Eventually
// TODO: Only load 5 posts
const ProfilePage = () => {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
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
        <View style={styles.followersContainer}>
          <View style={styles.follow}>
            <Text style={styles.userNameText}> 6 </Text>
            <Text style={styles.userNameText}> Followers</Text>
          </View>
          <View style={styles.follow}>
            <Text style={styles.userNameText}> 6 </Text>
            <Text style={styles.userNameText}> Followers</Text>
          </View>
        </View>
        {/* Favorites */}
        <View style={styles.favoritesContainer}>
          <Text style={styles.userNameText}> Favorites </Text>
          <View style={styles.favoriteScroll}>
            <FavoriteCard />
            <FavoriteCard />
            <FavoriteCard />
          </View>
        </View>
        {/* Posts */}
        <View
          style={{
            display: "flex",
            width: "100%",
            borderColor: "white",
            borderWidth: 2,
          }}
        >
          <ReviewCard />
        </View>

        {/* <View style={styles.favoritesContainer}>
          
        </View> */}
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
});
export default ProfilePage;
