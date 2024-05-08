import colors from "@/styles/colors";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import ReviewCard from "@/components/profile/ReviewCard";

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
      name: string; // Adding the museum name to the interface
    };
  };
}

async function fetchReviewsFromFollowedUsers(userId: string) {
  const { data: followedUsers, error: followError } = await supabase
    .from("user_follows_users")
    .select("following_id")
    .eq("follower_id", userId);

  console.log("followedUsers: ", followedUsers);

  if (followError) {
    console.error("Error fetching followed users:", followError);
    return [];
  }

  const followedUserIds = followedUsers.map((user) => user.following_id);

  console.log("FollowedUserIDS: ", followedUserIds);
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
    console.log("USER ID:", userId);
  }, [userId]);

  useEffect(() => {
    console.log("HELLO?");
    if (userId != "") {
      fetchReviewsFromFollowedUsers(userId)
        .then(setReviews)
        .catch(console.error);
    }
  }, [userId, reviewsUpdate]);

  return (
    <View style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.reviewsContainer}>
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              reviewId={review.id}
              pfp={review.user.avatar_url}
              username={review.user.username}
              text={review.text}
              exhibitionId={review.exhibition_id}
              exhibitionName={review.exhibition.title}
              museumId={review.exhibition.museum_id}
              coverPhoto={review.exhibition.cover_photo_url}
              museumName={review.exhibition.museum.name}
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
    gap: 12,
    padding: 12,
  },
});

export default UsersScreen;
