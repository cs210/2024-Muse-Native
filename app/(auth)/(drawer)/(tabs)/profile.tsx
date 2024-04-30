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
import { useEffect, useState } from "react";
import { router } from "expo-router";

// TODO: Unhardcode
// TODO: Add Lists Feature Eventually
// TODO: Only load 5 posts (Map)
// TODO: Click on profile and it grows
// TODO: Click on Followers / Following
// TODO: Only Fetch When Required to do so
// TODO: Click on Favorites
interface ReviewCardProps {
  reviewId: string; // Type for reviewId
}

interface Profile {
  id: string;
  username: string | null;
  follower_ids: string[]; // Array of user IDs who follow this user
  following_ids: string[]; // Array of user IDs this user follows
}
const ProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      setLoading(true);
      const { data: user, error: authError } = await supabase.auth.getUser();
      // IF FOLLOW HAPPENED, REFRESH
      if (authError) {
        console.error("Error fetching user:", authError);
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (!user) {
        setError("No user data available.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, follower_ids, following_ids")
        .eq("id", user?.user.id)
        .single();

      if (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } else {
        setUserProfile(data);
      }
      setLoading(false);
    };

    getUserData();
  }, []);

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
          <Text style={styles.userNameText}>{userProfile?.username}</Text>
        </View>
        {/*Followers / Following */}
        <View style={styles.followersContainer}>
          <View style={styles.follow}>
            <Text style={styles.userNameText}>
              {" "}
              {userProfile?.following_ids.length}{" "}
            </Text>
            <Text style={styles.userNameText}> Following </Text>
          </View>
          <View style={styles.follow}>
            <Text style={styles.userNameText}>
              {" "}
              {userProfile?.follower_ids.length}{" "}
            </Text>
            <Text style={styles.userNameText}>Followers</Text>
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
        <View style={styles.reviewsContainer}>
          <ReviewCard reviewId={1} />
          <ReviewCard reviewId={2} />
          <ReviewCard reviewId={3} />
          <ReviewCard reviewId={4} />
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
  reviewsContainer: {
    gap: 12,
  },
});
export default ProfilePage;
