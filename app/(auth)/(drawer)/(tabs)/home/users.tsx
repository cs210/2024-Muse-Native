import colors from "@/styles/colors";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import review from "../../review/[id]";
import ReviewCard from "@/components/profile/ReviewCard";

interface FollowedUser {
  followed_id: string; // Assumed data type, adjust according to your database schema
}

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

async function fetchReviewsFromFollowedUsers() {
  const { data: user, error: authError } = await supabase.auth.getUser();
  if (authError) {
    console.error("Authentication error:", authError);
    return [];
  }

  const { data: followedUsers, error: followError } = await supabase
    .from("user_follows_users")
    .select("following_id")
    .eq("follower_id", user.user?.id);

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

  useEffect(() => {
    fetchReviewsFromFollowedUsers().then(setReviews).catch(console.error);
  }, []);

  return (
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
  );
};

const styles = StyleSheet.create({
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
