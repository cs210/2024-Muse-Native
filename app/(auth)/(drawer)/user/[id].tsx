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
import { router, useLocalSearchParams } from "expo-router";

//TODO Jake SHOUlD GO TO JAKE PROFILE

interface Profile {
  id: string;
  username: string | null;
  follower_ids: string[]; // Array of user IDs who follow this user
  following_ids: string[]; // Array of user IDs this user follows
  avatar_url: string;
  favorite_exhibitions: string[]; // Array of favorite exhibition IDs
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

interface FavoriteExhibition {
  id: string;
  title: any;
}

const ProfilePage: React.FC = () => {
  const { id } = useLocalSearchParams();
  console.log(id);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [favoriteExhibitions, setFavoriteExhibitions] = useState<
    FavoriteExhibition[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get the user Data
  useEffect(() => {
    const getUserData = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id, username, follower_ids, following_ids, avatar_url, favorite_exhibitions"
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      } else {
        setUserProfile(data);
        fetchFavoriteExhibitions(data.id);
      }
    };
    getUserData();
  }, []);

  const fetchFavoriteExhibitions = async (userId: string) => {
    const { data, error } = await supabase
      .from("favorite_exhibitions")
      .select(
        `
      exhibition_id,
      user_id,
      exhibition:exhibition_id (title)  // This specifies you want to fetch 'title' from the related exhibition
    `
      )
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching favorite exhibitions:", error);
      setError(error.message);
    } else {
      setFavoriteExhibitions(
        data.map((item) => ({
          // TODO: Check why this isn't working
          id: item.exhibition_id,
          title: item.exhibition.title,
        }))
      );
    }
    setLoading(false);
  };

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
      params: { following: userProfile.following_ids, userId: userProfile.id },
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
            {favoriteExhibitions.map((exhibition) => (
              <FavoriteCard key={exhibition.id} exhibitionId={exhibition.id} />
            ))}
          </View>
        </View>
        {/* Posts */}
        <View style={styles.reviewsContainer}>
          {/* <ReviewCard reviewId={1} />
          <ReviewCard reviewId={2} />
          <ReviewCard reviewId={3} />
          <ReviewCard reviewId={4} /> */}
          <Text style={{ color: "white" }}>
            {/* {userReviews &&
              userReviews.length > 0 &&
              userReviews[0].exhibition.title} */}
          </Text>
        </View>
        {favoriteExhibitions.map((exhibition) => (
          <Text key={exhibition.id}>{exhibition.id}</Text>
        ))}
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
