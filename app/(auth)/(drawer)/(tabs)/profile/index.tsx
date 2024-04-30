import colors from "@/styles/colors";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
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
  avatar_url: string;
}

interface Review {
  id: string;
  created_at: string;
  exhibition_id: string;
  text: string;
  exhibition: {
    title: string;
  };
}
const ProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get the user Data
  useEffect(() => {
    const getUserData = async () => {
      setLoading(true);
      const { data: user, error: authError } = await supabase.auth.getUser();

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
        .select("id, username, follower_ids, following_ids, avatar_url")
        .eq("id", user.user.id)
        .single();

      if (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      } else {
        setUserProfile(data);
      }
    };
    getUserData();
  }, []);

  // Then get user reviews based on user data
  useEffect(() => {
    if (!userProfile) return;

    const getUserReviews = async () => {
      setLoading(true);
      const { data: userReviews, error } = await supabase
        .from("reviews")
        .select(`*, exhibition:exhibition_id(title)`)
        .eq("user_id", userProfile.id);

      if (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } else {
        setUserReviews(userReviews);
      }
      setLoading(false);
    };

    getUserReviews();
  }, [userProfile]); // This useEffect runs only when userProfile changes.

  const goToFollowing = () => {
    if (!userProfile) return;
    
    router.push({
      pathname: "/(auth)/(drawer)/(tabs)/profile/following",
      // TODO: Fix this red squiggly
      // !
      params: { following: userProfile.following_ids },
    });
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Container */}
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: userProfile?.avatar_url }}
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
          <TouchableOpacity style={styles.follow} onPress={goToFollowing}>
            <Text style={styles.userNameText}>
              {userProfile?.following_ids.length}
            </Text>
            <Text style={styles.userNameText}> Following </Text>
          </TouchableOpacity>
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
          <Text style={{ color: "white" }}>
            {userReviews &&
              userReviews.length > 0 &&
              userReviews[0].exhibition.title}
          </Text>
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
