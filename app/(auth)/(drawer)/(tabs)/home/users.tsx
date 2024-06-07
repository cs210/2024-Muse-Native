import colors from "@/styles/colors";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import ReviewCard from "@/components/profile/ReviewCard";
import { Review } from "@/utils/interfaces";
import { useNavigation } from "expo-router";

async function fetchReviewsFromFollowedUsers(userId: string) {
  const { data: followedUsers, error: followError } = await supabase
    .from("user_follows_users")
    .select("following_id")
    .eq("follower_id", userId);

  // console.log("followedUsers: ", followedUsers);

  if (followError) {
    console.error("Error fetching followed users:", followError);
    return [];
  }

  const followedUserIds = followedUsers.map((user) => user.following_id);

  if (followedUserIds.length === 0) {
    console.log("No followed users found.");
    return [];
  }

  const { data: reviews, error: reviewsError } = await supabase
    .from("reviews")
    .select(
      `
  id,
  exhibition_id,
  user_id,
  text,
  created_at,
  rating,
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
    .in("user_id", followedUserIds);

  if (reviewsError) {
    console.error("Error fetching reviews:", reviewsError);
    return [];
  }

  if (reviews.some((review) => review.exhibition === null)) {
    console.warn(
      "Some reviews have null exhibitions. Check data integrity and RLS policies."
    );
  }

  return reviews;
}

const UsersScreen = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userId, setUserId] = useState("");
  const [reviewsUpdate, setReviewsUpdate] = useState<boolean>(false);
  const navigator = useNavigation();

  const goToSearch = () => {
    navigator.navigate("search");
  };

  const channels = supabase
    .channel("custom-update-channel-2")
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
        setReviewsUpdate(!reviewsUpdate);
      }
    )
    .subscribe();

  useEffect(() => {
    const getUserId = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        // console.log("User ID:", session.user.id);
        const userId = session.user.id;
        setUserId(userId);
      }
    };
    getUserId();
  }, [userId]);

  useEffect(() => {
    if (userId != "") {
      fetchReviewsFromFollowedUsers(userId)
        .then(setReviews)
        .catch(console.error);
    }
  }, [userId, reviewsUpdate]);

  return (
    <View style={styles.outerContainer}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {reviews.length === 0 && (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              marginTop: 100,
              gap: 10,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                color: colors.text_pink,
                textAlign: "center",
              }}
            >
              You currently don't follow any users! Come back once you start
              following some!
            </Text>
            <TouchableOpacity
              onPress={goToSearch}
              style={{
                borderRadius: 10,
                backgroundColor: colors.plum_light,
                padding: 10,
                marginTop: 20,
              }}
            >
              <Text style={{ fontWeight: "bold", color: colors.text_pink }}>
                Find Users
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.reviewsContainer}>
          {reviews.toReversed().map((review) => (
            <ReviewCard
              key={review.id}
              reviewId={review.id}
              pfp={review.user.avatar_url}
              username={review.user.username}
              text={review.text}
              rating={review.rating}
              exhibitionId={review.exhibition_id}
              exhibitionName={review.exhibition.title}
              museumId={review.exhibition.museum_id}
              coverPhoto={review.exhibition.cover_photo_url}
              museumName={review.exhibition.museum.name}
              user_id={review.user_id}
              created_at={review.created_at}
              showImage={true}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    backgroundColor: colors.background,
    gap: 10,
  },
  reviewsContainer: {
    marginTop: 4,
    gap: 12,
    padding: 12,
  },
});

export default UsersScreen;
