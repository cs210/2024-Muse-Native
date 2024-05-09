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
import review from "../../review/[id]";

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
  username: string;
  avatar_url: string;
  favorite_exhibitions: string[]; // Array of favorite exhibition IDs
}

// interface Review {
//   id: string;
//   created_at: string;
//   exhibition_id: string;
//   text: string;
//   exhibition: {
//     title: string;
//   };
// }

interface Review {
  id: string;
  exhibition_id: string;
  user_id: string;
  text: string;
  created_at: Date;
  user: {
    avatar_url: string;
    username: string;
  };
  exhibition: {
    title: string;
    museum_id: string;
    cover_photo_url: string;
    museum: {
      name: string;
    };
  };
}

interface FavoriteExhibition {
  id: string;
  title: any;
}

const ProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [favoriteExhibitions, setFavoriteExhibitions] = useState<
    FavoriteExhibition[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [reviewsUpdate, setReviewsUpdate] = useState<boolean>(false);
  const [followCountUpdate, setFollowCountUpdate] = useState<boolean>(false);
  const [followedUserIds, setFollowedUserIds] = useState([""]);

  const channels = supabase
    .channel("custom-update-channel-5")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "reviews",
        filter: "user_id=eq.".concat(userId),
      },
      (payload) => {
        console.log("Change received!", payload);
        setReviewsUpdate(!reviewsUpdate);
      }
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "user_follows_users",
        filter: "follower_id=eq.".concat(userId),
      },
      (payload) => {
        console.log("Change received!", payload);
        setFollowCountUpdate(!followCountUpdate);
      }
    )
    .subscribe();

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
        .select("id, username, avatar_url, favorite_exhibitions")
        .eq("id", user.user.id)
        .single();

      if (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      } else {
        setUserProfile(data);
        fetchFavoriteExhibitions(data.id);
        setUserId(user.user.id);
      }

      const { data: followedUsers, error: followError } = await supabase
        .from("user_follows_users")
        .select("following_id")
        .eq("follower_id", userId);

      console.log("followedUsers: ", followedUsers);

      if (followError) {
        console.error("Error fetching followed users:", followError);
        return [];
      }

      const followedUserList = followedUsers.map((user) => user.following_id);

      console.log("FollowedUserIDS: ", followedUserIds);
      if (!followedUserIds) {
        console.log("No followed users found.");
      } else {
        setFollowedUserIds(followedUserList);
      }
    };
    getUserData();
  }, [userId, followCountUpdate]);

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
        .select(
          `
      id,
      exhibition_id,
      user_id,
      text,
      created_at,
      user: user_id (
        avatar_url,
        username
      ),
      exhibition: exhibition_id (
        museum_id,
        title,
        cover_photo_url,
        museum: museum_id (
          name
        )
      )
    `
        )
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
  }, [userProfile, reviewsUpdate]); // This useEffect runs only when userProfile changes.

  const goToFollowing = () => {
    if (!userProfile) return;

    router.push({
      pathname: "/(auth)/(drawer)/(tabs)/profile/following",
      // TODO: Fix this red squiggly
      // !
      params: { following: followedUserIds, userId: userProfile.id },
    });
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
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
            <Text style={styles.userNameText}>{followedUserIds.length}</Text>
            <Text style={styles.userNameText}> Following </Text>
          </TouchableOpacity>
          <View style={styles.follow}>
            <Text style={styles.userNameText}>1</Text>
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
        <Text style={styles.userNameText}> Reviews </Text>
        <View style={styles.reviewsContainer}>
          {userReviews.toReversed().map((review) => (
            <ReviewCard
              key={review.id}
              reviewId={review.id}
              pfp={userProfile.avatar_url}
              username={userProfile.username}
              text={review.text}
              exhibitionId={review.exhibition_id}
              exhibitionName={review.exhibition.title}
              museumId={review.exhibition.museum_id}
              coverPhoto={review.exhibition.cover_photo_url}
              museumName={review.exhibition.museum.name}
              user_id={userProfile?.id}
              showImage={true}
            />
          ))}
          <Text style={{ color: "white" }}>
            {/* {userReviews &&
              userReviews.length > 0 &&
              userReviews[0].exhibition.title} */}
          </Text>
        </View>
        {/* {favoriteExhibitions.map((exhibition) => (
          <Text key={exhibition.id}>{exhibition.id}</Text>
        ))} */}
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
    // borderColor: "white",
    // borderWidth: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  followersContainer: {
    // borderColor: "white",
    // borderWidth: 2,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: 10,
  },
  favoritesContainer: {
    // borderColor: "white",
    // borderWidth: 2,
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
    // borderColor: "white",
    // borderWidth: 2,
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
    // borderColor: "white",
    // borderWidth: 2,
  },
  reviewsContainer: {
    gap: 12,
  },
});
export default ProfilePage;
