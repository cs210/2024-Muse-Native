import colors from "@/styles/colors";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Animated,
} from "react-native";
import FavoriteCard from "@/components/profile/FavoriteCard";
import ReviewCard from "@/components/profile/ReviewCard";
import { supabase } from "@/utils/supabase";
import { useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import Review from "../review/[id]";
import CustomHeader from "@/components/CustomHeader";
import React from "react";

// TODO: Add Lists Feature Eventually
// TODO: Only load 5 posts (Map)
// TODO: Click on profile and it grows
// TODO: Only Fetch When Required to do so

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
  const { id } = useLocalSearchParams();
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [favoriteExhibitions, setFavoriteExhibitions] = useState<
    FavoriteExhibition[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [reviewsUpdate, setReviewsUpdate] = useState<boolean>(false);
  const [followCountUpdate, setFollowCountUpdate] = useState<boolean>(false);
  const [followedUserIds, setFollowedUserIds] = useState([""]);
  const [followingUserIds, setFollowingUserIds] = useState([""]);

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
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, avatar_url, favorite_exhibitions")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      } else {
        setUserProfile(data);
        fetchFavoriteExhibitions(data.id);
        setUserId(id);
      }

      const { data: followedUsers, error: followError } = await supabase
        .from("user_follows_users")
        .select("following_id")
        .eq("follower_id", id);

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

      const { data: followingUser, error: followingError } = await supabase
        .from("user_follows_users")
        .select("follower_id")
        .eq("following_id", id);

      if (followingError) {
        console.error("Error fetching followed users:", followingError);
        return [];
      }

      const followingUserList = followingUser.map((user) => user.follower_id);

      if (!followingUserIds) {
        console.log("No followed users found.");
      } else {
        setFollowingUserIds(followingUserList);
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
    console.log(userReviews);
  }, [userProfile, reviewsUpdate]); // This useEffect runs only when userProfile changes.

  const goToFollowing = () => {
    if (!userProfile) return;
    console.log("USER PROFILE" + userProfile.id);
    router.push({
      pathname: "/(auth)/(drawer)/user/following",
      params: { userId: userProfile.id },
    });
  };

  const goToFollowers = () => {
    if (!userProfile) return;

    router.push({
      pathname: "/(auth)/(drawer)/user/followers",
      params: { userId: userProfile.id },
    });
  };
  return (
    <View style={styles.safeContainer}>
      <CustomHeader title={userProfile?.username} scrollY={scrollY} />
      <Animated.ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: userProfile?.avatar_url }}
            style={styles.profileImage}
          />
          <Text style={styles.userNameText}>{userProfile?.username}</Text>
        </View>

        <View style={styles.followersContainer}>
          <TouchableOpacity style={styles.follow} onPress={goToFollowing}>
            <Text style={styles.userNameText}>{followedUserIds.length}</Text>
            <Text style={styles.userNameText}> Following </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.follow} onPress={goToFollowers}>
            <Text style={styles.userNameText}>{followingUserIds.length}</Text>
            <Text style={styles.userNameText}>Followers</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.favoritesContainer}>
          <Text style={styles.userNameText}> Favorites </Text>
          <View style={styles.favoriteScroll}>
            {favoriteExhibitions.length === 0 ? (
              <Text style={styles.noFavoritesText}>
                Displaying your favorite exhibitions is still under development,
                sorry for the inconvenience... If you want to check out how it
                would look, feel free to go to Jake or Pedro's profile!
              </Text>
            ) : (
              favoriteExhibitions.map((exhibition) => (
                <FavoriteCard
                  key={exhibition.id}
                  exhibitionId={exhibition.id}
                />
              ))
            )}
          </View>
        </View>

        <Text style={styles.userNameText}> Reviews </Text>
        <View style={styles.reviewsContainer}>
          {userReviews.length === 0 && (
            <Text style={{ fontFamily: "Poppins_700Bold", color: "white" }}>
              {" "}
              This User still doesn't have any reviews
            </Text>
          )}
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
              created_at={review.created_at}
            />
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 12,
    paddingVertical: 40,
    backgroundColor: colors.background,
    gap: 10,
    paddingBottom: 500, // Ensure there's enough space at the bottom
  },
  profileContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  followersContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: 10,
  },
  favoritesContainer: {
    marginTop: 10,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 10,
  },
  follow: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  userNameText: {
    color: colors.text_pink,
    fontFamily: "Inter_700Bold",
    fontSize: 17,
  },
  favoriteScroll: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  noFavoritesText: {
    color: "white",
    fontSize: 17,
    marginBottom: 20,
  },
  reviewsContainer: {
    gap: 12,
  },
});

export default ProfilePage;
